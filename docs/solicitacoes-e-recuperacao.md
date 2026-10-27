# Solicitações personalizadas e recuperação de senha

Implementadas em 13 de outubro de 2026.

## Solicitações

`/solicitar-imovel` recebe finalidade, tipo, cidade, UF, orçamento máximo, mínimo de quartos e descrição. Apenas clientes autenticados enviam; client_id é obtido da identidade verificada, nunca do formulário. Orçamento deve ser finito, positivo e até 1 trilhão; quartos inteiros entre 0 e 100; descrição entre 10 e 5.000 caracteres.

Migração `202610130001_property_search_requests.sql` aplicada ao Supabase real pelo SQL Editor, com resultado Success. Tabela privada com RLS: cliente consulta apenas seus registros, administrador consulta todos; corretores e visitantes não consultam os pedidos. Inserção restrita ao próprio cliente. Não há alteração/exclusão pela aplicação. Restrições de tamanho, números e UF também estão no banco.

`/dashboard/solicitacoes` lista até 100 registros recentes. Administração consulta nome e telefone do cliente através das permissões existentes de profiles. A área administrativa real consultou a tabela com sucesso e exibiu o estado vazio. Não há distribuição automática para corretores, status de atendimento ou email de notificação nesta etapa.

## Recuperação

Login oferece Esqueci minha senha; `/recuperar-senha` solicita email, Supabase envia link PKCE para `/auth/recuperacao`, que troca o código por sessão e abre `/nova-senha`. A rota também aceita token_hash apenas com tipo recovery. Endereço http://localhost:3100/auth/recuperacao adicionado e confirmado na lista de redirects do Supabase. A URL de confirmação existente foi preservada.

A senha deve ter 8–128 caracteres e confirmação igual. A ação verifica identidade com Auth antes de updateUser; não altera senha de outra conta nem aceita ID do formulário. A página de nova senha também pode ser usada por uma sessão autenticada para alterar sua própria senha. Links inválidos voltam à recuperação com aviso. Respostas de envio são neutras para não revelar contas existentes.

PKCE exige abrir o link no mesmo navegador que iniciou o pedido. O suporte alternativo a token_hash requer adaptar o template de email; o template atual não foi alterado. Antes de publicar, adicionar os endereços do domínio definitivo e configurar o serviço de emails. Referência: https://supabase.com/docs/guides/auth/passwords.

## Validação

Build/TypeScript e git diff --check passaram. Testes isolados verificaram bloqueio de visitante/corretor, identidade não falsificável e rejeição de orçamento inválido. Tela de recuperação e consulta real administrativa conferidas no navegador. Conforme combinado, envio de solicitação por cliente real e ciclo completo de email/alteração de senha ficaram para os testes com o usuário. Nenhum email enviado nem senha real alterada nesta etapa. Sem commit/push.
