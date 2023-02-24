-- デフォルト権限からanonを外す
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on functions from anon;
alter default privileges in schema public revoke all on sequences from anon;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  uuid_id uuid :=gen_random_uuid();
begin
  if new.raw_user_meta_data ->>'tenant_id' is null then
    insert into public.tenants (id, tenant_name) 
    values (uuid_id,  new.raw_user_meta_data ->>'tenant_name');
    insert into public.profiles (tenant_id, user_id, user_name, role)
    values (uuid_id, new.id, new.raw_user_meta_data ->>'user_name', 'manager'); 
    return new;
  else
    insert into public.profiles (tenant_id, user_id, user_name, role)
    values (new.raw_user_meta_data ->>'tenant_id', new.id, new.raw_user_meta_data ->>'user_name', 'general'); 
    return new;
  end if;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


create or replace function set_tenant_id (tenant_id uuid)
  returns void as $$
  begin
  select set_config('app.current_tenant', tenant_id);
  end;
  $$ language plpgsql;





