insert into storage.buckets (id,name,public) values ('repair-photos','repair-photos',true) on conflict (id) do nothing;
create policy "service role manages repair-photos objects" on storage.objects for all using (bucket_id='repair-photos' and auth.role() = 'service_role') with check (bucket_id='repair-photos' and auth.role() = 'service_role');
