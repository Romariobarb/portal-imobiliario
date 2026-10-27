# Acompanhamento administrativo

Em 13 de outubro de 2026, `/admin` passou a mostrar contagens exatas de corretores pendentes, imóveis em análise e solicitações personalizadas, consultadas no Supabase. As solicitações são o total registrado, não uma contagem de itens ainda não atendidos.

Busca por nome/CRECI/localidade de corretor e título/localidade/bairro/CRECI de imóvel, ignorando acentos e maiúsculas. Filtros de status separados para corretores e imóveis, com valores permitidos e busca limitada a 100 caracteres. Parâmetros não são usados para compor SQL. Limpar filtros retorna à listagem completa carregada.

Imóveis em todos os estados são consultáveis na fila, incluindo rascunhos, ajustes, rejeitados e arquivados. As decisões continuam disponíveis apenas conforme o fluxo de moderação existente. Links diretos abrem contatos recebidos e solicitações personalizadas.

A listagem e busca ainda operam sobre as linhas retornadas pelo limite padrão do Supabase, normalmente 1.000. Antes de um volume maior, migrar filtros para consultas paginadas no banco. Os contadores usam count exact e não dependem desse limite.

Build/TypeScript e diff check passaram. Painel autenticado consultou dados reais no navegador: um corretor pendente e zero imóveis em análise/solicitações. Não foram modificados cadastros ou permissões.
