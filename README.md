# Astro Negócios Imobiliários

Portal Next.js 16 com TypeScript, Tailwind e Supabase real. Catálogo público usa somente imóveis e corretores aprovados; não usa os imóveis de demonstração.

## Execução local

Instale as dependências, configure `.env.local` a partir de `.env.example` e execute `npm run dev -- --port 3100`. Abra http://localhost:3100.

`.env.local` é privado e não deve ser incluído na entrega ou versionamento. Não há chave administrativa no navegador.

## Funcionalidades implementadas

Cadastro e login de clientes e corretores, confirmação por email, recuperação de senha, área profissional, conferência manual de CRECI, moderação de corretores e anúncios, fotos privadas no Storage, catálogo e diretório público, mensagens de interesse, solicitações personalizadas e acompanhamento do atendimento.

## Validação e entrega

Execute `npm run build` e `git diff --check`. Consulte `docs/entrega-aprovacao.md` para escopo, limitações e roteiro de aprovação. Documentação técnica adicional está em `docs/`.

Migrações em `supabase/migrations/` foram aplicadas ao projeto conectado pelo painel. Não execute novamente migrations de criação em um banco já configurado. Testes transacionais estão em `supabase/tests/` e usam rollback.

## Antes da publicação

Configurar envio de emails automáticos, definir conteúdo oficial e privacidade, executar os testes completos com contas reais, configurar domínio e URLs de Auth, revisar hospedagem e aprovar publicação. Nenhum commit ou push deve ser feito sem aprovação.
