begin;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('property-photos','property-photos',false,6291456,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy property_photos_upload on storage.objects for insert to authenticated with check (
 bucket_id='property-photos' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.brokers where profile_id=(select auth.uid()) and status='approved')
);
create policy property_photos_read on storage.objects for select to anon,authenticated using (
 bucket_id='property-photos' and (
 (storage.foldername(name))[1]=(select auth.uid())::text or public.is_admin()
 or exists(select 1 from public.property_images i join public.properties p on p.id=i.property_id join public.brokers b on b.id=p.broker_id
 where p.status='approved' and b.status='approved' and b.profile_id::text=(storage.foldername(name))[1]
 and right(i.url,length('/storage/v1/object/authenticated/property-photos/'||name))='/storage/v1/object/authenticated/property-photos/'||name)
 )
);
commit;
