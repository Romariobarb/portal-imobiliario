# Interesse em anúncios

O botão Tenho interesse no detalhe abre `/imoveis/[slug]/contato`. A página consulta apenas anúncios e corretores aprovados. Visitantes podem consultar o anúncio, mas precisam entrar como cliente para enviar uma mensagem. O login preserva o destino do contato quando o slug usa caracteres alfanuméricos, hífen ou sublinhado.

A ação valida identidade e papel no servidor, obtém client_id da sessão verificada e limita a mensagem a 10–5.000 caracteres. Não aceita identidade fornecida pelo formulário. A inserção usa a tabela property_requests e as políticas RLS já aplicadas, que validam cliente, publicação e aprovação do corretor no momento da gravação. Não usa chave administrativa.

`/dashboard/contatos` mostra até 100 registros recentes autorizados pelas políticas: próprio cliente, corretor responsável aprovado ou administrador. Uma mensagem permanece consultável pelo cliente quando o anúncio deixa de ser público; nesse caso o título pode aparecer como Anúncio indisponível. Nome, telefone e email privados de profiles não são expostos ao corretor. A tela orienta o cliente a incluir na mensagem o contato desejado e informa que esse conteúdo é compartilhado com o responsável e a administração.

Não há resposta interna, status de atendimento, notificações automáticas ou bloqueio de mensagens repetidas entre envios separados. Uma solicitação genérica de busca de imóvel ainda é uma etapa distinta.

Build/TypeScript e diff check passaram. Testes isolados com banco simulado verificaram bloqueio anônimo/profissional, identidade não falsificável, tamanho da mensagem, erro de autorização e retorno seguro. A área autenticada da administração consultou a tabela real e exibiu o estado vazio no navegador. Envio completo de uma mensagem real ainda depende de uma conta de cliente confirmada e de um anúncio aprovado; nenhum cadastro ou imóvel fictício foi criado.
