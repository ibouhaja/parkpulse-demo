CREATE TABLE public.demo_reservations (
 id uuid PRIMARY KEY, user_id uuid NOT NULL, facility_id text NOT NULL CHECK(facility_id IN ('quartier','ufer','stadtgarten','werk','markt','nord')), level text NOT NULL CHECK(level IN ('P1','P2','P3')), bay text NOT NULL CHECK(bay ~ '^B(0[1-9]|[1-3][0-9]|4[0-8])$'), starts_at timestamptz NOT NULL, hours numeric NOT NULL CHECK(hours > 0 AND hours <= 72), price numeric NOT NULL, status text NOT NULL DEFAULT 'booked' CHECK(status IN ('booked','arrived','cancelled','completed')), created_at timestamptz NOT NULL DEFAULT now(), session_id text
);
GRANT SELECT ON public.demo_reservations TO authenticated;
GRANT ALL ON public.demo_reservations TO service_role;
ALTER TABLE public.demo_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY reservations_read_own ON public.demo_reservations FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE UNIQUE INDEX demo_reservation_held_spot ON public.demo_reservations(facility_id,level,bay) WHERE status IN ('booked','arrived');
CREATE FUNCTION public.demo_held_positions() RETURNS TABLE(facility_id text,level text,bay text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT facility_id,level,bay FROM public.demo_reservations WHERE status IN ('booked','arrived') $$;
REVOKE ALL ON FUNCTION public.demo_held_positions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.demo_held_positions() TO anon,authenticated,service_role;
CREATE FUNCTION public.demo_book_spot(p_id uuid,p_user uuid,p_facility text,p_level text,p_bay text,p_start timestamptz,p_hours numeric) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 IF EXISTS(SELECT 1 FROM demo_reservations WHERE id=p_id AND user_id=p_user) THEN RETURN p_id; END IF;
 IF p_start < now()-interval '1 minute' OR p_start > now()+interval '365 days' THEN RAISE EXCEPTION 'Ungültiger Reservierungstermin.'; END IF;
 IF EXISTS(SELECT 1 FROM parking_states WHERE state->'session'->>'facilityId'=p_facility AND upper(state->'session'->>'level')=p_level AND ('B'||lpad(regexp_replace(state->'session'->>'bay','[^0-9]','','g'),2,'0'))=p_bay) THEN RAISE EXCEPTION 'Dieser Stellplatz ist bereits belegt.'; END IF;
 INSERT INTO demo_reservations(id,user_id,facility_id,level,bay,starts_at,hours,price) VALUES(p_id,p_user,p_facility,p_level,p_bay,p_start,p_hours,ceil(p_hours)*2);
 RETURN p_id;
END $$;
REVOKE ALL ON FUNCTION public.demo_book_spot(uuid,uuid,text,text,text,timestamptz,numeric) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_book_spot(uuid,uuid,text,text,text,timestamptz,numeric) TO service_role;
CREATE FUNCTION public.demo_save_state(p_user uuid,p_version integer,p_state jsonb,p_arrival uuid DEFAULT NULL) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.demo_reservations; s jsonb;
BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 PERFORM 1 FROM parking_states WHERE user_id=p_user AND version=p_version FOR UPDATE;
 IF NOT FOUND THEN RETURN false; END IF;
 s:=p_state->'session';
 IF p_arrival IS NOT NULL THEN
  SELECT * INTO r FROM demo_reservations WHERE id=p_arrival AND user_id=p_user FOR UPDATE;
  IF NOT FOUND OR r.status <> 'booked' THEN RAISE EXCEPTION 'Reservierung nicht verfügbar.'; END IF;
  IF s->>'facilityId' <> r.facility_id OR s->>'level' <> r.level OR s->>'bay' <> r.bay THEN RAISE EXCEPTION 'Ungültige Parkposition.'; END IF;
 END IF;
 IF EXISTS(SELECT 1 FROM demo_reservations WHERE status IN ('booked','arrived') AND facility_id=s->>'facilityId' AND level=upper(s->>'level') AND bay=('B'||lpad(regexp_replace(s->>'bay','[^0-9]','','g'),2,'0')) AND (user_id<>p_user OR (status='booked' AND id IS DISTINCT FROM p_arrival))) THEN RAISE EXCEPTION 'Dieser Stellplatz ist reserviert.'; END IF;
 UPDATE parking_states SET state=p_state,version=version+1 WHERE user_id=p_user;
 IF p_arrival IS NOT NULL THEN UPDATE demo_reservations SET status='arrived',session_id=s->>'id' WHERE id=p_arrival; END IF;
 UPDATE demo_reservations SET status='completed' WHERE user_id=p_user AND status='arrived' AND EXISTS(SELECT 1 FROM jsonb_array_elements(p_state->'receipts') x WHERE x->>'sessionId'=session_id);
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.demo_save_state(uuid,integer,jsonb,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_save_state(uuid,integer,jsonb,uuid) TO service_role;
CREATE FUNCTION public.demo_cancel_booking(p_user uuid,p_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN PERFORM pg_advisory_xact_lock(883421); UPDATE demo_reservations SET status='cancelled' WHERE user_id=p_user AND id=p_id AND status='booked'; RETURN FOUND; END $$;
REVOKE ALL ON FUNCTION public.demo_cancel_booking(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_cancel_booking(uuid,uuid) TO service_role;