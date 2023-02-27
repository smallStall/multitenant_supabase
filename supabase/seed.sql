-- デフォルト権限からanonを外す
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on functions from anon;
alter default privileges in schema public revoke all on sequences from anon;


-- ユーザー登録時にtenant_idがあればそのテナントの一般ユーザーだとみなして登録する
-- tenant_idがなければテナントの管理ユーザーだとみなして登録する
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  tenant_id uuid :=gen_random_uuid();
begin
  if new.raw_user_meta_data ->>'tenant_id' is null then -- 管理ユーザー登録の場合
    insert into public.tenants (id, tenant_name) 
    values (tenant_id,  new.raw_user_meta_data ->>'tenant_name');
    insert into public.profiles (tenant_id, user_id, user_name, role)
    values (tenant_id, new.id, new.raw_user_meta_data ->>'user_name', 'manager'); 
    update auth.users
    set raw_user_meta_data = to_jsonb(jsonb_build_object('tenant_id', tenant_id))
    where id = new.id;
  else -- 一般ユーザー登録の場合
    insert into public.profiles (tenant_id, user_id, user_name, role)
    values (cast(new.raw_user_meta_data ->>'tenant_id' as uuid), new.id, new.raw_user_meta_data ->>'user_name', 'general');
    update auth.users
    set raw_user_meta_data = to_jsonb(jsonb_build_object('tenant_id', new.raw_user_meta_data ->>'tenant_id'))
    where id = new.id;
  end if;
  return new;  
end;
$$;


-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


create or replace function set_tenant_id (tenant_id text)
  returns void as $$
  begin
  perform set_config('app.tenant', tenant_id, false);
  end;
  $$ language plpgsql;


