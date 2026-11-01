ALTER TABLE public.demo_reservations ADD COLUMN reservation_status text NOT NULL DEFAULT 'confirmed' CHECK(reservation_status IN ('confirmed','cancelled','checked_in','completed','no_show')), ADD COLUMN grace_minutes integer NOT NULL DEFAULT 15 CHECK(grace_minutes BETWEEN 1 AND 120), ADD COLUMN fee_cents integer NOT NULL DEFAULT 0 CHECK(fee_cents>=0), ADD COLUMN fee_percent integer NOT NULL DEFAULT 0 CHECK(fee_percent IN (0,25,50,100)), ADD COLUMN resolved_at timestamptz, ADD COLUMN cancellation_id uuid;
UPDATE public.demo_reservations SET reservation_status=CASE status WHEN 'arrived' THEN 'checked_in' WHEN 'cancelled' THEN 'cancelled' WHEN 'completed' THEN 'completed' ELSE 'confirmed' END;
CREATE TABLE public.reservation_cancellation_quotes(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL,reservation_id uuid NOT NULL REFERENCES public.demo_reservations(id),price numeric NOT NULL,percent integer NOT NULL,fee_cents integer NOT NULL,expires_at timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.reservation_cancellation_quotes TO authenticated;
GRANT ALL ON public.reservation_cancellation_quotes TO service_role;
ALTER TABLE public.reservation_cancellation_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY cancellation_quotes_owner ON public.reservation_cancellation_quotes FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE FUNCTION public.demo_cancellation_percent(p_start timestamptz,p_now timestamptz) RETURNS integer LANGUAGE sql IMMUTABLE SET search_path=public AS $$ SELECT CASE WHEN p_start-p_now>interval '3 hours' THEN 0 WHEN p_start-p_now>=interval '2 hours' THEN 25 WHEN p_start-p_now>=interval '1 hour' THEN 50 ELSE 100 END $$;
REVOKE ALL ON FUNCTION public.demo_cancellation_percent(timestamptz,timestamptz) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_cancellation_percent(timestamptz,timestamptz) TO service_role;
CREATE FUNCTION public.demo_reservation_lifecycle_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF TG_OP='UPDATE' THEN
  IF OLD.reservation_status IN ('cancelled','completed','no_show') AND (NEW.reservation_status IS DISTINCT FROM OLD.reservation_status OR NEW.status IS DISTINCT FROM OLD.status OR NEW.fee_cents IS DISTINCT FROM OLD.fee_cents OR NEW.fee_percent IS DISTINCT FROM OLD.fee_percent OR NEW.resolved_at IS DISTINCT FROM OLD.resolved_at OR NEW.cancellation_id IS DISTINCT FROM OLD.cancellation_id) THEN RAISE EXCEPTION 'Terminal reservation is immutable'; END IF;
  IF NEW.price IS DISTINCT FROM OLD.price OR NEW.starts_at IS DISTINCT FROM OLD.starts_at OR NEW.grace_minutes IS DISTINCT FROM OLD.grace_minutes THEN RAISE EXCEPTION 'Reservation terms are immutable'; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.reservation_status=OLD.reservation_status THEN
   IF NEW.status='arrived' THEN NEW.reservation_status:='checked_in';
   ELSIF NEW.status='completed' THEN NEW.reservation_status:='completed';
   ELSE RAISE EXCEPTION 'Explicit cancellation quote required'; END IF;
  END IF;
  IF OLD.reservation_status='confirmed' AND NEW.reservation_status='checked_in' AND clock_timestamp()>=OLD.starts_at+make_interval(mins=>OLD.grace_minutes) THEN RAISE EXCEPTION 'No-show deadline reached'; END IF;
 END IF;
 NEW.status:=CASE NEW.reservation_status WHEN 'confirmed' THEN 'booked' WHEN 'checked_in' THEN 'arrived' WHEN 'completed' THEN 'completed' ELSE 'cancelled' END;
 RETURN NEW;
END $$;
CREATE TRIGGER demo_reservation_lifecycle_guard BEFORE INSERT OR UPDATE ON public.demo_reservations FOR EACH ROW EXECUTE FUNCTION public.demo_reservation_lifecycle_guard();
CREATE FUNCTION public.demo_reconcile_no_shows() RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE n integer; BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 UPDATE public.demo_reservations SET reservation_status='no_show',fee_percent=100,fee_cents=round(price*100),resolved_at=clock_timestamp() WHERE reservation_status='confirmed' AND clock_timestamp()>=starts_at+make_interval(mins=>grace_minutes);
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.demo_reconcile_no_shows() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_reconcile_no_shows() TO service_role;
CREATE FUNCTION public.demo_before_booking_reconcile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN PERFORM public.demo_reconcile_no_shows(); RETURN NEW; END $$;
CREATE TRIGGER demo_before_booking_reconcile BEFORE INSERT ON public.demo_reservations FOR EACH STATEMENT EXECUTE FUNCTION public.demo_before_booking_reconcile();
CREATE FUNCTION public.demo_quote_cancellation(p_user uuid,p_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE r public.demo_reservations; q public.reservation_cancellation_quotes; pct integer; BEGIN
 PERFORM public.demo_reconcile_no_shows();
 SELECT * INTO r FROM public.demo_reservations WHERE id=p_id AND user_id=p_user FOR UPDATE;
 IF NOT FOUND OR r.reservation_status<>'confirmed' THEN RAISE EXCEPTION 'Reservation cannot be cancelled'; END IF;
 pct:=public.demo_cancellation_percent(r.starts_at,clock_timestamp());
 INSERT INTO public.reservation_cancellation_quotes(user_id,reservation_id,price,percent,fee_cents,expires_at) VALUES(p_user,p_id,r.price,pct,round(round(r.price*100)*pct/100),clock_timestamp()+interval '60 seconds') RETURNING * INTO q;
 RETURN jsonb_build_object('id',q.id,'reservationId',q.reservation_id,'price',q.price,'percent',q.percent,'feeCents',q.fee_cents,'expiresAt',floor(extract(epoch FROM q.expires_at)*1000));
END $$;
REVOKE ALL ON FUNCTION public.demo_quote_cancellation(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_quote_cancellation(uuid,uuid) TO service_role;
CREATE FUNCTION public.demo_confirm_cancellation(p_user uuid,p_quote uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE r public.demo_reservations; q public.reservation_cancellation_quotes; BEGIN
 PERFORM public.demo_reconcile_no_shows();
 SELECT * INTO q FROM public.reservation_cancellation_quotes WHERE id=p_quote AND user_id=p_user;
 IF NOT FOUND THEN RAISE EXCEPTION 'Quote not found'; END IF;
 SELECT * INTO r FROM public.demo_reservations WHERE id=q.reservation_id AND user_id=p_user FOR UPDATE;
 IF r.reservation_status='cancelled' AND r.cancellation_id=q.id THEN RETURN jsonb_build_object('id',r.id,'status',r.reservation_status,'feeCents',r.fee_cents,'percent',r.fee_percent); END IF;
 IF r.reservation_status<>'confirmed' OR clock_timestamp()>q.expires_at OR public.demo_cancellation_percent(r.starts_at,clock_timestamp())<>q.percent THEN RAISE EXCEPTION 'Quote expired or status changed'; END IF;
 UPDATE public.demo_reservations SET reservation_status='cancelled',fee_cents=q.fee_cents,fee_percent=q.percent,resolved_at=clock_timestamp(),cancellation_id=q.id WHERE id=r.id;
 RETURN jsonb_build_object('id',r.id,'status','cancelled','feeCents',q.fee_cents,'percent',q.percent);
END $$;
REVOKE ALL ON FUNCTION public.demo_confirm_cancellation(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_confirm_cancellation(uuid,uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.demo_cancel_booking(p_user uuid,p_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN RAISE EXCEPTION 'Explicit cancellation quote required'; END $$;
COMMENT ON FUNCTION public.demo_cancel_booking(uuid,uuid) IS 'DEPRECATED: use demo_quote_cancellation and demo_confirm_cancellation';