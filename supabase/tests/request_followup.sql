begin;
do $$
declare admin_id uuid; request_id uuid; original_time timestamptz; actual_status text;
begin
 select id into admin_id from public.profiles where role='admin' limit 1;
 if admin_id is null then raise exception 'Test requires existing administrator'; end if;
 insert into public.property_search_requests(client_id,operation_type,property_type,city,state,budget,bedrooms,message,status,handled_by)
 values(admin_id,'sale','Casa','Teste transacional','MG',100,0,'Registro somente para validação com rollback','completed',admin_id)
 returning id,updated_at into request_id,original_time;
 select status into actual_status from public.property_search_requests where id=request_id;
 if actual_status<>'new' or exists(select 1 from public.property_search_requests where id=request_id and handled_by is not null) then raise exception 'Forged initial status'; end if;
 perform set_config('request.jwt.claim.sub',admin_id::text,true);
 perform public.update_request_followup('search',request_id,original_time,'in_progress');
 if not exists(select 1 from public.property_search_requests where id=request_id and status='in_progress' and handled_by=admin_id) then raise exception 'Update failed'; end if;
 begin
  perform public.update_request_followup('search',request_id,original_time,'completed');
  raise exception 'Stale update accepted';
 exception when serialization_failure then null; end;
 perform set_config('request.jwt.claim.sub','',true);
 begin
  perform public.update_request_followup('search',request_id,original_time,'completed');
  raise exception 'Unauthenticated update accepted';
 exception when insufficient_privilege then null; end;
end; $$;
rollback;
