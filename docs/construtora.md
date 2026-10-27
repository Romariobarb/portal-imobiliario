# Vitrine da construtora

Escopo confirmado pelo usuário: apresentação pública dos empreendimentos, sem cadastro, autenticação específica ou painel de construtora.

`/construtora` lista os empreendimentos e `/construtora/[slug]` apresenta fotos, descrição, localização, estágio, diferenciais e informação de entrega quando disponível. Links no cabeçalho e rodapé. As páginas são acessíveis sem conta.

O conteúdo editorial fica em `src/data/developments.ts`, com contrato tipado e lista inicialmente vazia. Inserir somente informações e imagens aprovadas pelo cliente. Não há anúncios fictícios nem associação automática com os imóveis do Supabase. Atualizações editoriais exigem alteração desse arquivo e nova publicação; não há painel de conteúdo.

O cliente precisa fornecer, para cada empreendimento: nome, localização, descrição, estágio (planejamento/construção/entregue), fotos com textos alternativos, diferenciais e informação de entrega quando aplicável. Contatos oficiais serão acrescentados quando enviados. Enquanto isso, o visitante pode explorar o catálogo ou informar o imóvel que procura.

Build/TypeScript e diff check passaram. HTTP confirmou vitrine 200 e empreendimento inexistente 404; tela vazia conferida no navegador. A página de detalhe com conteúdo real depende do material do cliente.
