CREATE OR REPLACE FUNCTION public.demo_cancellation_percent(p_start timestamptz,p_now timestamptz) RETURNS integer LANGUAGE sql IMMUTABLE SET search_path=public AS $$ SELECT CASE WHEN p_start-p_now>interval '2 hours' THEN 0 WHEN p_start-p_now>=interval '1 hour' THEN 50 ELSE 100 END $$;
ALTER TABLE public.reservation_cancellation_quotes ADD COLUMN batch_id uuid;
CREATE INDEX reservation_cancellation_quotes_batch ON public.reservation_cancellation_quotes(batch_id) WHERE batch_id IS NOT NULL;
CREATE FUNCTION public.demo_quote_cancellation_batch(p_user uuid,p_ids uuid[]) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE b uuid:=gen_random_uuid(); r public.demo_reservations; pct integer; items jsonb:='[]'::jsonb; total integer:=0; fee integer; q uuid; exp timestamptz:=clock_timestamp()+interval '5 minutes'; BEGIN
 IF p_ids IS NULL OR cardinality(p_ids)=0 OR cardinality(p_ids)>50 THEN RAISE EXCEPTION 'No reservations selected'; END IF;
 PERFORM public.demo_reconcile_no_shows();
 FOR r IN SELECT * FROM public.demo_reservations WHERE id=ANY(p_ids) AND user_id=p_user ORDER BY starts_at FOR UPDATE LOOP
  IF r.reservation_status<>'confirmed' THEN RAISE EXCEPTION 'Reservation cannot be cancelled'; END IF;
  pct:=public.demo_cancellation_percent(r.starts_at,clock_timestamp());
  fee:=round(round(r.price*100)*pct/100);
  INSERT INTO public.reservation_cancellation_quotes(user_id,reservation_id,price,percent,fee_cents,expires_at,batch_id) VALUES(p_user,r.id,r.price,pct,fee,exp,b) RETURNING id INTO q;
  total:=total+fee;
  items:=items||jsonb_build_object('id',q,'reservationId',r.id,'facilityId',r.facility_id,'level',r.level,'bay',r.bay,'startsAt',r.starts_at,'hours',r.hours,'price',r.price,'percent',pct,'feeCents',fee);
 END LOOP;
 IF jsonb_array_length(items)<>cardinality(ARRAY(SELECT DISTINCT unnest(p_ids))) THEN RAISE EXCEPTION 'Reservation not found'; END IF;
 RETURN jsonb_build_object('batchId',b,'items',items,'totalFeeCents',total,'expiresAt',floor(extract(epoch FROM exp)*1000));
END $$;
REVOKE ALL ON FUNCTION public.demo_quote_cancellation_batch(uuid,uuid[]) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_quote_cancellation_batch(uuid,uuid[]) TO service_role;
CREATE FUNCTION public.demo_confirm_cancellation_batch(p_user uuid,p_batch uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE q record; res jsonb:='[]'::jsonb; total integer:=0; one jsonb; BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 IF NOT EXISTS(SELECT 1 FROM public.reservation_cancellation_quotes WHERE batch_id=p_batch AND user_id=p_user) THEN RAISE EXCEPTION 'Quote not found'; END IF;
 FOR q IN SELECT id FROM public.reservation_cancellation_quotes WHERE batch_id=p_batch AND user_id=p_user ORDER BY created_at,id LOOP
  one:=public.demo_confirm_cancellation(p_user,q.id);
  total:=total+(one->>'feeCents')::integer; res:=res||one;
 END LOOP;
 RETURN jsonb_build_object('batchId',p_batch,'items',res,'totalFeeCents',total);
END $$;
REVOKE ALL ON FUNCTION public.demo_confirm_cancellation_batch(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_confirm_cancellation_batch(uuid,uuid) TO service_role;
CREATE FUNCTION public.demo_reschedule(p_user uuid,p_batch uuid,p_id uuid,p_facility text,p_level text,p_bay text,p_start timestamptz,p_hours numeric,p_price numeric,p_tariff jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE c jsonb; BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 IF EXISTS(SELECT 1 FROM public.demo_reservations WHERE id=p_id AND user_id=p_user) THEN RETURN jsonb_build_object('id',p_id,'replayed',true); END IF;
 IF (SELECT count(*) FROM public.reservation_cancellation_quotes WHERE batch_id=p_batch AND user_id=p_user)<>1 THEN RAISE EXCEPTION 'Quote not found'; END IF;
 c:=public.demo_confirm_cancellation_batch(p_user,p_batch);
 PERFORM public.demo_book_spot_priced(p_id,p_user,p_facility,p_level,p_bay,p_start,p_hours,p_price,p_tariff);
 RETURN jsonb_build_object('id',p_id,'cancellation',c);
END $$;
REVOKE ALL ON FUNCTION public.demo_reschedule(uuid,uuid,uuid,text,text,text,timestamptz,numeric,numeric,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_reschedule(uuid,uuid,uuid,text,text,text,timestamptz,numeric,numeric,jsonb) TO service_role;