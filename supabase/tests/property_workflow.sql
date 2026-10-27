-- Run through the SQL Editor. All users, approvals and listings are rolled back.
begin;
create temporary table workflow_fixture(key text primary key, id uuid);
grant all on workflow_fixture to authenticated, anon;
insert into workflow_fixture values ('admin',gen_random_uuid()),('broker',gen_random_uuid()),('other',gen_random_uuid());
insert into auth.users(id,raw_user_meta_data) select id,case when key='admin' then '{}'::jsonb else jsonb_build_object('registration_kind','broker','full_name','Teste transacional','phone','11999999999','creci','TEST-'||left(id::text,18),'city','São Paulo','state','SP') end from workflow_fixture;
update public.profiles set role='admin' where id=(select id from workflow_fixture where key='admin');
insert into workflow_fixture select 'broker_record',id from public.brokers where profile_id=(select id from workflow_fixture where key='broker');
insert into workflow_fixture select 'other_record',id from public.brokers where profile_id=(select id from workflow_fixture where key='other');
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='admin'),true);
set local role authenticated;
select public.record_creci_check((select id from workflow_fixture where key='broker_record'),(select updated_at from public.brokers where id=(select id from workflow_fixture where key='broker_record')),'Teste transacional','confirmed','SP','Conferência fictícia para teste transacional');
select public.moderate_listing('broker',(select id from workflow_fixture where key='broker_record'),'pending','approved','Teste transacional');
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='broker'),true);
insert into workflow_fixture values ('listing',public.save_listing('{"operation_type":"sale","property_type":"Casa","title":"Imóvel de teste","description":"Descrição transacional do imóvel","price":100000,"city":"São Paulo","state":"SP","neighborhood":"Centro","area":50,"bedrooms":2,"suites":1,"bathrooms":1,"parking_spaces":1,"features":[],"images":["https://example.invalid/foto.jpg"]}'::jsonb,null,true,null));
do $$ declare blocked boolean:=false; body jsonb; stamp timestamptz; begin
  if not exists(select 1 from public.properties where id=(select id from workflow_fixture where key='listing') and status='pending') then raise exception 'Submission failed'; end if;
  begin perform public.moderate_listing('property',(select id from workflow_fixture where key='listing'),'pending','approved',''); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'Broker self approval allowed'; end if;
  blocked:=false;
  select to_jsonb(p)||jsonb_build_object('images',jsonb_build_array('https://example.invalid/foto.jpg')),updated_at into body,stamp from public.properties p where id=(select id from workflow_fixture where key='listing');
  begin perform public.save_listing(body,(select id from workflow_fixture where key='listing'),false,stamp); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'Pending listing is editable'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
do $$ begin if exists(select 1 from public.properties where id=(select id from workflow_fixture where key='listing')) then raise exception 'Pending listing is public'; end if; end $$;
reset role;
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='admin'),true);
set local role authenticated;
select public.moderate_listing('property',(select id from workflow_fixture where key='listing'),'pending','changes_requested','Corrigir descrição');
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='broker'),true);
do $$ declare body jsonb; stamp timestamptz; blocked boolean:=false; begin
  select to_jsonb(p)||jsonb_build_object('images',jsonb_build_array('https://example.invalid/foto.jpg')),updated_at into body,stamp from public.properties p where id=(select id from workflow_fixture where key='listing');
  begin perform public.save_listing(body,(select id from workflow_fixture where key='listing'),true,stamp-interval '1 second'); exception when serialization_failure then blocked:=true; end;
  if not blocked then raise exception 'Stale save allowed'; end if;
  -- Invalid images must roll back both the edit and replacement of existing images.
  blocked:=false;
  begin perform public.save_listing(body||'{"images":["http://example.invalid/foto.jpg"]}'::jsonb,(select id from workflow_fixture where key='listing'),true,stamp); exception when check_violation then blocked:=true; end;
  if not blocked or not exists(select 1 from public.property_images where property_id=(select id from workflow_fixture where key='listing') and url='https://example.invalid/foto.jpg') then raise exception 'Atomic image replacement failed'; end if;
  perform public.save_listing(body,(select id from workflow_fixture where key='listing'),true,stamp);
end $$;
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='other'),true);
do $$ declare blocked boolean:=false; begin
  begin perform public.save_listing('{}'::jsonb,null,false,null); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'Unapproved broker can save'; end if;
  if exists(select 1 from public.properties where id=(select id from workflow_fixture where key='listing')) then raise exception 'Other broker can see pending listing'; end if;
end $$;
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='admin'),true);
select public.record_creci_check((select id from workflow_fixture where key='other_record'),(select updated_at from public.brokers where id=(select id from workflow_fixture where key='other_record')),'Teste transacional','confirmed','SP','Conferência fictícia para teste de isolamento');
select public.moderate_listing('broker',(select id from workflow_fixture where key='other_record'),'pending','approved','Teste de isolamento');
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='other'),true);
do $$ declare blocked boolean:=false; begin
  begin perform public.save_listing('{"operation_type":"sale","property_type":"Casa","title":"Tentativa de outro corretor","description":"Descrição transacional do imóvel","price":100000,"city":"São Paulo","state":"SP","neighborhood":"Centro","area":50,"bedrooms":2,"suites":1,"bathrooms":1,"parking_spaces":1,"features":[],"images":["https://example.invalid/foto.jpg"]}'::jsonb,(select id from workflow_fixture where key='listing'),false,now()); exception when insufficient_privilege then blocked:=true; end;
  if not blocked then raise exception 'Approved broker can edit another broker listing'; end if;
end $$;
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='admin'),true);
select public.moderate_listing('property',(select id from workflow_fixture where key='listing'),'pending','approved','');
reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
do $$ begin if not exists(select 1 from public.properties where id=(select id from workflow_fixture where key='listing') and published_at is not null) then raise exception 'Approved property is not public'; end if; end $$;
reset role;
select set_config('request.jwt.claim.sub',(select id::text from workflow_fixture where key='admin'),true);
set local role authenticated;
select public.moderate_listing('broker',(select id from workflow_fixture where key='broker_record'),'approved','suspended','Suspensão de teste');
reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
do $$ begin if exists(select 1 from public.properties where id=(select id from workflow_fixture where key='listing')) then raise exception 'Suspended broker listing is public'; end if; end $$;
reset role;
do $$ begin
  if (select count(*) from public.moderation_events where broker_id=(select id from workflow_fixture where key='broker_record') or property_id=(select id from workflow_fixture where key='listing'))<>4 then raise exception 'Review history incomplete'; end if;
end $$;
select 'PASS: cadastro, revisão, ajustes, publicação, suspensão, histórico, concorrência e RLS' as validation;
rollback;
