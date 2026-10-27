begin;
create temporary table creci_fixture(key text primary key,id uuid);
grant all on creci_fixture to authenticated,anon;
insert into creci_fixture values ('admin',gen_random_uuid()),('broker',gen_random_uuid()),('other',gen_random_uuid());
insert into auth.users(id,raw_user_meta_data) select id,case when key='admin' then '{}'::jsonb else jsonb_build_object('registration_kind','broker','full_name','Teste CRECI','phone','11999999999','creci','CRECI-'||left(id::text,18),'city','São Paulo','state','SP') end from creci_fixture;
update public.profiles set role='admin' where id=(select id from creci_fixture where key='admin');
insert into creci_fixture select 'broker_record',id from public.brokers where profile_id=(select id from creci_fixture where key='broker');
select set_config('request.jwt.claim.sub',(select id::text from creci_fixture where key='admin'),true);
set local role authenticated;
do $$ declare blocked boolean:=false; begin
 begin perform public.moderate_listing('broker',(select id from creci_fixture where key='broker_record'),'pending','approved',''); exception when check_violation then blocked:=true; end;
 if not blocked then raise exception 'Approval without verification allowed'; end if;
end $$;
select public.record_creci_check((select id from creci_fixture where key='broker_record'),(select updated_at from public.brokers where id=(select id from creci_fixture where key='broker_record')),'Teste CRECI','not_found','SP','Resultado fictício não localizado para teste');
do $$ declare blocked boolean:=false; begin
 begin perform public.moderate_listing('broker',(select id from creci_fixture where key='broker_record'),'pending','approved',''); exception when check_violation then blocked:=true; end;
 if not blocked then raise exception 'Approval after not_found allowed'; end if;
end $$;
select public.record_creci_check((select id from creci_fixture where key='broker_record'),(select updated_at from public.brokers where id=(select id from creci_fixture where key='broker_record')),'Teste CRECI','confirmed','SP','Resultado fictício confirmado para teste');
do $$ declare blocked boolean:=false; begin
 begin perform public.record_creci_check((select id from creci_fixture where key='broker_record'),now()-interval '1 day','Teste CRECI','confirmed','SP','Consulta obsoleta de teste'); exception when serialization_failure then blocked:=true; end;
 if not blocked then raise exception 'Stale verification allowed'; end if;
end $$;
select set_config('request.jwt.claim.sub',(select id::text from creci_fixture where key='broker'),true);
do $$ declare blocked boolean:=false; begin
 begin perform public.record_creci_check((select id from creci_fixture where key='broker_record'),now(),'Teste CRECI','confirmed','SP','Tentativa de auto conferência'); exception when insufficient_privilege then blocked:=true; end;
 if not blocked then raise exception 'Self verification allowed'; end if;
 if (select count(*) from public.creci_checks)<>2 then raise exception 'Owner cannot read own history'; end if;
end $$;
select set_config('request.jwt.claim.sub',(select id::text from creci_fixture where key='other'),true);
do $$ begin if exists(select 1 from public.creci_checks) then raise exception 'Another broker reads history'; end if; end $$;
select set_config('request.jwt.claim.sub',(select id::text from creci_fixture where key='admin'),true);
update public.profiles set full_name='Nome alterado' where id=(select id from creci_fixture where key='broker');
do $$ declare blocked boolean:=false; begin
 begin perform public.moderate_listing('broker',(select id from creci_fixture where key='broker_record'),'pending','approved',''); exception when check_violation then blocked:=true; end;
 if not blocked then raise exception 'Changed name does not invalidate verification'; end if;
end $$;
update public.profiles set full_name='Teste CRECI' where id=(select id from creci_fixture where key='broker');
select public.moderate_listing('broker',(select id from creci_fixture where key='broker_record'),'pending','approved','Aprovação fictícia');
do $$ begin if (select status from public.brokers where id=(select id from creci_fixture where key='broker_record'))<>'approved' then raise exception 'Verified broker cannot be approved'; end if; end $$;
reset role;
select 'PASS: required verification, not_found, stale check, self verification, privacy, name change and approval' as result;
rollback;
