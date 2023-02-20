-- デフォルト権限からanonを外す
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on functions from anon;
alter default privileges in schema public revoke all on sequences from anon;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, user_name, role)
  values (new.id, new.raw_user_meta_data ->>'name', 'manager');
  return new;
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

