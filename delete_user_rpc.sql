CREATE OR REPLACE FUNCTION public.delete_user() RETURNS void AS $$ BEGIN DELETE FROM auth.users WHERE id = auth.uid(); END; $$ LANGUAGE plpgsql SECURITY DEFINER;
