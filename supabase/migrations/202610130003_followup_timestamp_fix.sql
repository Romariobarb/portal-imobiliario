begin;
create or replace function public.update_request_followup(kind text,target_id uuid,expected_updated_at timestamptz,decision text) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); request_updated_at timestamptz; current_status text;
begin
 if actor is null or decision is null or decision not in ('new','in_progress','completed') or expected_updated_at is null then raise exception 'Invalid request' using errcode='42501'; end if;
 if kind='search' then
  if not public.is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
  select updated_at,status into request_updated_at,current_status from public.property_search_requests where id=target_id for update;
 elsif kind='contact' then
  if not public.is_admin() and not exists(select 1 from public.property_requests r join public.properties p on p.id=r.property_id join public.brokers b on b.id=p.broker_id where r.id=target_id and b.profile_id=actor and b.status='approved') then raise exception 'Not authorized' using errcode='42501'; end if;
  select updated_at,status into request_updated_at,current_status from public.property_requests where id=target_id for update;
 else raise exception 'Invalid request' using errcode='42501'; end if;
 if request_updated_at is null or request_updated_at<>expected_updated_at then raise exception 'Request changed; refresh' using errcode='40001'; end if;
 if current_status=decision then return; end if;
 if kind='search' then update public.property_search_requests set status=decision,updated_at=clock_timestamp(),handled_by=actor where id=target_id;
 else update public.property_requests set status=decision,updated_at=clock_timestamp(),handled_by=actor where id=target_id; end if;
end; $$;
commit;
