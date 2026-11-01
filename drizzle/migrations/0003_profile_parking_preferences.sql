ALTER TABLE public.profiles ADD COLUMN parking_preferences jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD CONSTRAINT profile_preferences_object CHECK(jsonb_typeof(parking_preferences)='object');
COMMENT ON COLUMN public.profiles.parking_preferences IS 'Owner-editable vehicle and parking needs; never roles or rewards. UI normalizes values before filtering.';
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE pref jsonb;
BEGIN
 pref:=NEW.raw_user_meta_data->'parking_preferences';
 IF pref IS NULL OR jsonb_typeof(pref)<>'object' OR octet_length(pref::text)>4000 THEN pref:='{}'::jsonb; END IF;
 INSERT INTO public.profiles(id,display_name,parking_preferences)
 VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'display_name',NEW.raw_user_meta_data->>'full_name',split_part(NEW.email,'@',1),''),60),pref)
 ON CONFLICT(id) DO NOTHING;
 RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC,anon,authenticated;