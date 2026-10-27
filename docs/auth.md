# Autenticação de corretores

Implementada em 7 de outubro de 2026 no projeto Supabase `jnutgaczakhewkkhqawx`.

## Fluxo

- `/cadastro`: nome, email, telefone, CRECI, cidade, UF, senha e confirmação. Validação no servidor; papel e status não são campos editáveis.
- Supabase Auth cria a conta. O trigger `initialize_profile` cria perfil e corretor na mesma transação, inclusive quando confirmação por email está habilitada. O perfil recebe `broker` e o corretor recebe `pending`. Metadados não podem definir papel de administrador nem status aprovado.
- `/auth/callback` aceita código PKCE e token_hash de tipo signup. Falhas retornam ao login com orientação para entrar com senha ou reenviar a confirmação; não afirmam que a conta deixou de ser confirmada. O destino é fixo. O template remoto permanece padrão: personalizá-lo exige SMTP próprio ou plano Pro. Para um template personalizado, usar `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`.
- `/login`: email/senha; erros de confirmação, limite e credenciais inválidas; formulário separado para reenviar confirmação, sem revelar se um email existe.
- `/dashboard`: identidade verificada no servidor; mostra nome, CRECI, localidade e status. Corretores aprovados acessam o editor de imóveis; administradores acessam a moderação.
- Logout encerra sessão e retorna ao login. RLS e guardas existentes continuam impedindo autoaprovação e publicação por corretores pendentes.

## Banco e configuração remota

A migração `202610070002_broker_registration.sql` foi aplicada pelo SQL Editor. Acrescenta cidade/UF em `brokers` e substitui o trigger de criação de perfil. As cinco tabelas mantêm RLS.

Supabase Auth Site URL: `http://localhost:3100`.
Redirect URL permitida: `http://localhost:3100/auth/callback`.
Para rodar novamente: `npm run dev -- --port 3100`. Ao publicar ou trocar a porta, atualizar Site URL e a URL exata de callback no Supabase.

## Verificação

Build, checagem TypeScript e `git diff --check`. Rotas de cadastro/login respondem 200; dashboard sem sessão redireciona ao login; callback inválido retorna erro. Teste transacional no Supabase confirmou perfil/corretor atômicos e bloqueios contra metadados com `role=admin`, autoaprovação e criação de imóveis por pendentes. Os registros desse teste foram revertidos com rollback.

O fluxo completo de email, login com conta confirmada e logout deve ser conferido com uma conta real pelo usuário; nenhuma senha real ou novo usuário permanente foi criado nos testes automatizados.

Referências: https://supabase.com/docs/guides/auth/server-side/nextjs e https://supabase.com/docs/guides/auth/managing-user-data.
