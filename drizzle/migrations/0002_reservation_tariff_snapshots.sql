ALTER TABLE public.demo_reservations ADD COLUMN tariff jsonb;
COMMENT ON COLUMN public.demo_reservations.tariff IS 'Trusted tariff snapshot for new reservations. NULL retains legacy EUR 2/hour; existing price remains unchanged.';
CREATE FUNCTION public.demo_book_spot_priced(p_id uuid,p_user uuid,p_facility text,p_level text,p_bay text,p_start timestamptz,p_hours numeric,p_price numeric,p_tariff jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(883421);
 IF EXISTS(SELECT 1 FROM demo_reservations WHERE id=p_id AND user_id=p_user) THEN RETURN p_id; END IF;
 IF p_hours IS NULL OR p_hours<=0 OR p_hours>72 OR p_price IS NULL OR p_price<0 OR p_tariff IS NULL THEN RAISE EXCEPTION 'Ungültiger Tarif.'; END IF;
 IF p_start < now()-interval '1 minute' OR p_start > now()+interval '365 days' THEN RAISE EXCEPTION 'Ungültiger Reservierungstermin.'; END IF;
 IF EXISTS(SELECT 1 FROM parking_states WHERE state->'session'->>'facilityId'=p_facility AND upper(state->'session'->>'level')=p_level AND ('B'||lpad(regexp_replace(state->'session'->>'bay','[^0-9]','','g'),2,'0'))=p_bay) THEN RAISE EXCEPTION 'Dieser Stellplatz ist bereits belegt.'; END IF;
 INSERT INTO demo_reservations(id,user_id,facility_id,level,bay,starts_at,hours,price,tariff) VALUES(p_id,p_user,p_facility,p_level,p_bay,p_start,p_hours,p_price,p_tariff);
 RETURN p_id;
END $$;
REVOKE ALL ON FUNCTION public.demo_book_spot_priced(uuid,uuid,text,text,text,timestamptz,numeric,numeric,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.demo_book_spot_priced(uuid,uuid,text,text,text,timestamptz,numeric,numeric,jsonb) TO service_role;