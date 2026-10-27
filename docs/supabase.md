# Base Supabase

## Análise e estrutura
A raiz usa Next.js 16/App Router, TypeScript e Tailwind. As três páginas leem `src/data/properties.ts`; os dados, componentes e identidade visual permanecem intactos. A pasta não rastreada `portal-imobiliario/` é uma cópia preexistente e não foi alterada.

- `src/lib/supabase`: clientes browser/server tipados, leitura de ambiente e renovação de sessão por cookies.
- `src/proxy.ts`: integração de sessão para Next.js 16; sem variáveis, deixa as páginas mockadas funcionar.
- `src/lib/auth/session.ts`: identidade verificada por `getUser()` e perfil consultado com RLS. Nenhuma tela de login ou rota protegida foi criada.
- `src/types`: domínio e contrato Database inicial, alinhado à migração. Tipos de Insert/Update não substituem a autorização no banco.
- `supabase/migrations`: migração inicial transacional, ainda não aplicada a um projeto remoto.

## Configuração
Execute `npm install`. Copie `.env.example` para `.env.local` e preencha a URL e a chave pública/publishable do projeto Supabase. Nunca use service_role/secret em NEXT_PUBLIC. O build atual não exige credenciais, porque as páginas usam mocks e os clientes são criados sob demanda.

Aplique `supabase/migrations/202610070001_initial_schema.sql` pelo SQL Editor de um projeto novo, ou via Supabase CLI (`supabase init`, `supabase link --project-ref <ref>`, `supabase db push`). A migração cria perfis para usuários existentes e um trigger para novos usuários. Não cria projeto Supabase nem inventa credenciais.

## Tabelas e relações
- `profiles`: 1:1 com `auth.users`; nome, telefone e papel. Papel inicial sempre client, sem confiar em metadata.
- `brokers`: 1:1 com profiles, CRECI único, bio e status de aprovação.
- `properties`: N:1 com brokers, UUID, slug único para preservar URLs, todos os campos imobiliários solicitados, timestamps e publicação. Valores monetários em BRL, área em m²; property_tax representa IPTU anual e condominium_fee valor mensal.
- `property_images`: N:1 com properties, URL HTTPS, texto alternativo e posição única por imóvel. Apenas modelagem; sem Storage/upload.
- `property_requests`: solicitações de contato de clientes autenticados, N:1 com properties e profiles. Mensagem privada e imutável; sem envio de email. Histórico de moderação será uma tabela separada na próxima etapa.

## Autorização
RLS habilitado em todas as tabelas. Público vê somente imóveis approved de corretores approved e suas imagens; vê o cadastro público dos corretores aprovados, mas não seus profiles/telefones. Cliente lê/edita o próprio perfil e cria/lê seus pedidos. Corretor solicita cadastro pending e lê seus imóveis; somente aprovado cria drafts e edita drafts/changes_requested ou envia para pending. Imóveis em revisão/publicados não são editáveis pelo corretor. Imagens seguem as mesmas restrições. Corretor aprovado lê contatos dos próprios imóveis. Suspensão oculta seus imóveis do catálogo e bloqueia novas alterações/contatos para ele.

Administrador lê os registros e modera por updates autenticados; guardas no banco impedem alteração de role, aprovação de corretor e autopublicação por usuários comuns. `is_admin()` consulta profiles com SECURITY DEFINER e search_path fixo para evitar recursão de RLS. Admin inicial é provisionado por SQL confiável no SQL Editor: `update public.profiles set role = 'admin' where id = '<uuid>';`. Ao aprovar um corretor, um administrador deve atualizar brokers.status e profiles.role para broker em uma transação. O status aprovado no cadastro é a autoridade para gerenciar imóveis. Não há exclusão via API de perfis, corretores, imóveis ou contatos nesta etapa.

## Migração gradual e próximos passos
1. Configurar o projeto/ambiente, aplicar a migração e gerar tipos com `supabase gen types typescript --linked > src/types/database.ts`.
2. Validar RLS com usuários client/broker/admin e anon em ambiente de teste, incluindo tentativas de escalar role/status e acessar contatos alheios.
3. Criar login/logout, callback e ações autenticadas; exigir identidade no servidor e manter autorização no banco.
4. Adicionar repositório de imóveis e adaptador de apresentação (UUID vs id numérico, sale/rent vs Venda/Aluguel, parking_spaces vs parking e imagens/corretor). Migrar cada página gradualmente, preservando slugs/layout. Nenhum fallback silencioso de falhas do banco para mocks.
5. Implementar fluxos de cadastro/aprovação e histórico de moderação, depois Storage com políticas próprias. Email, pagamento e dashboards estão fora desta etapa.

Referência: https://supabase.com/docs/guides/auth/server-side/nextjs
