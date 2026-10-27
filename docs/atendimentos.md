# Acompanhamento dos atendimentos

Contatos e solicitações personalizadas têm situação Novo, Em atendimento ou Concluído, data da última atualização e identificação interna do responsável pela última mudança. A situação aparece para o cliente na mesma área onde consulta seus pedidos. As duas listas oferecem filtros por situação, aplicados no banco antes do limite de 100 registros.

Administrador atualiza qualquer atendimento. Corretor aprovado atualiza somente contatos de seus próprios imóveis. Solicitações personalizadas ficam sob administração; clientes apenas consultam. A função update_request_followup verifica a permissão no banco, bloqueia a linha e exige o timestamp original para evitar sobrescrever uma atualização concorrente. É permitido reabrir um atendimento concluído. Alterar para a mesma situação não modifica a data.

As tabelas continuam sem permissão de update direto para usuários. Um trigger de inserção força Novo, data atual e responsável vazio, impedindo que o remetente forje a situação inicial. Mensagem, imóvel e identidade do cliente não são alterados pelo acompanhamento. Não há exclusão, histórico completo de transições ou notificações por email nesta etapa.

Migrações 202610130002_request_followup.sql e 202610130003_followup_timestamp_fix.sql aplicadas ao Supabase real. A segunda corrige o nome de variável usado na comparação de timestamp; a primeira também contém a definição corrigida para instalações novas.

Build/TypeScript e diff check passaram. request_followup.sql executado no banco e revertido com rollback: situação inicial não falsificável, atualização por administrador, responsável correto, conflito por timestamp e bloqueio anônimo. O primeiro teste encontrou a comparação incorreta; após a correção, passou. Nenhum dado de teste permanente ou cadastro real foi modificado. Filtro Em atendimento conferido na área autenticada real, atualmente vazia. Fluxo completo pela interface com clientes/corretores continua para a etapa de testes combinada.
