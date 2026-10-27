# Diretório público de corretores

A página `/corretores` consulta o Supabase real e mostra somente cadastros aprovados. A busca aceita cidade ou UF, sem diferenciar maiúsculas ou acentos.

Cada cartão informa CRECI, cidade, estado e quantidade de imóveis publicados. `/corretores/[id]` reúne os dados profissionais públicos e os imóveis aprovados daquele corretor. Cadastros pendentes, rejeitados, suspensos ou inexistentes retornam 404 nessa rota. Os filtros de aprovação são explícitos mesmo quando a consulta usa uma sessão administrativa.

Nome, telefone e email do perfil privado não são consultados nem expostos. A identificação pública atual usa o CRECI; a biografia profissional aparece quando preenchida. Não há dados fictícios. Sem cadastros aprovados, a página explica que novos profissionais aparecerão após a aprovação.

Validação: build e TypeScript passaram; `git diff --check` sem erros. Consultas HTTP verificaram a listagem, o filtro e respostas 404 para IDs inválidos ou inexistentes. Layout conferido no navegador em largura de celular. Ainda não há corretor aprovado para conferir um perfil público preenchido com dados reais.
