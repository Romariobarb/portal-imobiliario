# Astro — versão para aprovação

Data: 14 de outubro de 2026.

## Objetivo desta avaliação

Avaliar a identidade visual, navegação e os fluxos implementados. A versão está em ambiente local e ainda não foi publicada. Aprovação da apresentação não substitui os testes completos de operação.

## Implementado

- Identidade Astro com logo, azul-marinho, dourado e fundo claro.
- Vitrine pública de empreendimentos da construtora, com estrutura de detalhes e conteúdo aguardando envio pelo cliente.
- Catálogo de compra e aluguel, detalhes e fotos, acessíveis sem cadastro.
- Cadastro de clientes e corretores, login, confirmação de email e recuperação de senha.
- Área de corretor: apresentação, cadastro de imóveis, fotos e envio para análise.
- Administração: conferência manual de CRECI, aprovação de corretor, revisão dos anúncios, filtros e resumo.
- Diretório público de corretores aprovados e respectivos imóveis.
- Interesse em um anúncio, solicitação personalizada e acompanhamento Novo / Em atendimento / Concluído.

## Antes da publicação definitiva

- Validar com contas reais os cadastros, confirmação e recuperação por email, aprovação, fotos, publicação e atendimentos.
- Fornecer os contatos oficiais, endereço, apresentação institucional e textos de privacidade da Astro.
- Configurar e implementar notificações automáticas; os emails de autenticação já usam o Supabase, mas o serviço definitivo de envio precisa ser definido.
- Concluir gestão de administradores pela interface; acesso administrativo inicial existe, e nenhuma nova permissão foi concedida nesta revisão.
- Receber e inserir os empreendimentos reais da construtora; vitrine pública e páginas de detalhe implementadas, sem cadastro ou painel conforme escopo confirmado.
- Definir hospedagem, domínio, URLs de autenticação e disponibilizar uma prévia online para avaliação externa.
- Incluir imóveis reais e aprovar corretores após conferência. Atualmente o catálogo não possui anúncios publicados.

## Roteiro da avaliação

1. Conferir logo, cores, textos e aparência no computador e celular.
2. Navegar em Comprar, Alugar, Imóveis e Corretores sem criar conta.
3. Avaliar cadastro, login e clareza das mensagens.
4. Em demonstração assistida, conhecer a área profissional e a revisão administrativa.
5. Conferir os campos da solicitação de imóvel e o acompanhamento do atendimento.
6. Registrar ajustes desejados por página e aprovar ou solicitar revisão da apresentação.

## Evidências desta revisão

Build e TypeScript passaram. O teste HTTP verificou oito páginas públicas, proteção de cinco áreas restritas e recusa de recuperação sem token. Rodapé e cabeçalho atualizados e página inicial conferida visualmente. Os testes operacionais com contas reais permanecem pendentes, conforme combinado. Nenhum email enviado ao cliente, commit, push ou publicação efetuado.

## Acesso

http://localhost:3100 funciona no computador onde o projeto está rodando. Esse endereço não permite ao cliente acessar de outro local. O envio de uma prévia online depende de configurar a hospedagem; este documento e a apresentação HTML podem ser compartilhados como material de avaliação.
