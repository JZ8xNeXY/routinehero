-- line_link_tokens テーブルのRLSポリシー

-- サーバーサイド（service_role）からのすべての操作を許可
create policy "Service role can manage line_link_tokens"
  on public.line_link_tokens
  for all
  to service_role
  using (true)
  with check (true);

-- 認証済みユーザーが自分の家族のトークンを管理できるようにする
create policy "Users can manage their family's line_link_tokens"
  on public.line_link_tokens
  for all
  to authenticated
  using (
    family_id in (
      select id from public.families
      where user_id = auth.uid()
    )
  )
  with check (
    family_id in (
      select id from public.families
      where user_id = auth.uid()
    )
  );
