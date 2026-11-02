CREATE TABLE public.integration_events(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 reservation_id uuid NOT NULL,
 previous_reservation_id uuid,
 event_type text NOT NULL CHECK(event_type IN ('reservation.confirmed','reservation.cancelled','reservation.rescheduled','reservation.no_show')),
 payload jsonb NOT NULL,
 delivery_status text NOT NULL DEFAULT 'pending' CHECK(delivery_status IN ('pending','sending','sent','failed')),
 attempts integer NOT NULL DEFAULT 0,
 last_error text,
 last_http_status integer,
 next_attempt_at timestamptz NOT NULL DEFAULT now(),
 lease_until timestamptz,
 sent_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX integration_events_due ON public.integration_events(next_attempt_at) WHERE delivery_status IN ('pending','sending');
CREATE INDEX integration_events_user ON public.integration_events(user_id,created_at DESC);
GRANT SELECT ON public.integration_events TO authenticated;
GRANT ALL ON public.integration_events TO service_role;
ALTER TABLE public.integration_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY integration_events_owner ON public.integration_events FOR SELECT TO authenticated USING(user_id=auth.uid());

CREATE TABLE public.demo_reminders(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 reservation_id uuid NOT NULL REFERENCES public.demo_reservations(id),
 idempotency_key text NOT NULL,
 source_event_id uuid,
 title text NOT NULL,
 message text NOT NULL,
 reservation_status text NOT NULL,
 scheduled_for timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(reservation_id,idempotency_key));
CREATE INDEX demo_reminders_user ON public.demo_reminders(user_id,created_at DESC);
GRANT SELECT ON public.demo_reminders TO authenticated;
GRANT ALL ON public.demo_reminders TO service_role;
ALTER TABLE public.demo_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY demo_reminders_owner ON public.demo_reminders FOR SELECT TO authenticated USING(user_id=auth.uid());

CREATE FUNCTION public.n8n_reservation_payload(r public.demo_reservations) RETURNS jsonb LANGUAGE sql STABLE SET search_path=public AS $$
 SELECT jsonb_build_object('id',r.id,'status',r.reservation_status,'facilityId',r.facility_id,'level',r.level,'bay',r.bay,'startsAt',r.starts_at,'hours',r.hours,'priceCents',round(r.price*100)::integer,'feeCents',r.fee_cents,'feePercent',r.fee_percent,'graceMinutes',r.grace_minutes,'resolvedAt',r.resolved_at) $$;
REVOKE ALL ON FUNCTION public.n8n_reservation_payload(public.demo_reservations) FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.n8n_enqueue_reservation_event() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE t text; BEGIN
 IF coalesce(current_setting('parkpulse.rescheduling',true),'')<>'' THEN RETURN NEW; END IF;
 IF TG_OP='INSERT' AND NEW.reservation_status='confirmed' THEN t:='reservation.confirmed';
 ELSIF TG_OP='UPDATE' AND NEW.reservation_status IS DISTINCT FROM OLD.reservation_status AND NEW.reservation_status IN ('cancelled','no_show') THEN t:=CASE NEW.reservation_status WHEN 'cancelled' THEN 'reservation.cancelled' ELSE 'reservation.no_show' END;
 ELSE RETURN NEW; END IF;
 INSERT INTO integration_events(user_id,reservation_id,event_type,payload) VALUES(NEW.user_id,NEW.id,t,jsonb_build_object('reservation',public.n8n_reservation_payload(NEW)));
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.n8n_enqueue_reservation_event() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER n8n_enqueue_reservation_event AFTER INSERT OR UPDATE OF reservation_status ON public.demo_reservations FOR EACH ROW EXECUTE FUNCTION public.n8n_enqueue_reservation_event();

CREATE OR REPLACE FUNCTION public.demo_reschedule(p_user uuid,p_batch uuid,p_id uuid,p_facility text,p_level text,p_bay text,p_start timestamptz,p_hours numeric,p_price numeric,p_tariff jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE c jsonb; old_id uuid; n public.demo_reservations; o public.demo_reservations; BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 IF EXISTS(SELECT 1 FROM public.demo_reservations WHERE id=p_id AND user_id=p_user) THEN RETURN jsonb_build_object('id',p_id,'replayed',true); END IF;
 IF (SELECT count(*) FROM public.reservation_cancellation_quotes WHERE batch_id=p_batch AND user_id=p_user)<>1 THEN RAISE EXCEPTION 'Quote not found'; END IF;
 SELECT reservation_id INTO old_id FROM public.reservation_cancellation_quotes WHERE batch_id=p_batch AND user_id=p_user;
 PERFORM set_config('parkpulse.rescheduling',p_id::text,true);
 c:=public.demo_confirm_cancellation_batch(p_user,p_batch);
 PERFORM public.demo_book_spot_priced(p_id,p_user,p_facility,p_level,p_bay,p_start,p_hours,p_price,p_tariff);
 PERFORM set_config('parkpulse.rescheduling','',true);
 SELECT * INTO n FROM public.demo_reservations WHERE id=p_id; SELECT * INTO o FROM public.demo_reservations WHERE id=old_id;
 INSERT INTO public.integration_events(user_id,reservation_id,previous_reservation_id,event_type,payload) VALUES(p_user,p_id,old_id,'reservation.rescheduled',jsonb_build_object('reservation',public.n8n_reservation_payload(n),'previousReservation',public.n8n_reservation_payload(o)));
 RETURN jsonb_build_object('id',p_id,'cancellation',c);
END $$;

CREATE FUNCTION public.n8n_claim_events(p_limit integer) RETURNS SETOF public.integration_events LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$
 UPDATE integration_events e SET delivery_status='sending',lease_until=clock_timestamp()+interval '60 seconds',attempts=e.attempts+1
 WHERE e.id IN (SELECT id FROM integration_events WHERE ((delivery_status='pending' AND next_attempt_at<=clock_timestamp()) OR (delivery_status='sending' AND lease_until<clock_timestamp())) ORDER BY created_at LIMIT least(greatest(p_limit,1),25) FOR UPDATE SKIP LOCKED)
 RETURNING e.* $$;
REVOKE ALL ON FUNCTION public.n8n_claim_events(integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.n8n_claim_events(integer) TO service_role;