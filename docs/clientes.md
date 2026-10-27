# Contas de clientes

`/cadastro/cliente` oferece nome, email, telefone, senha e confirmação de senha. A ação no servidor valida os dados e usa Supabase Auth com confirmação por email. O login e a rota de confirmação são compartilhados com os corretores.

A função `initialize_profile` da migração já aplicada `202610070002_broker_registration.sql` cria o perfil de cliente atomicamente. A ação envia apenas os dados de contato e o marcador de cliente. Não aceita papel, status profissional ou permissões do formulário. Não cria registro em `brokers`; contas existentes não são convertidas.

Clientes autenticados veem sua área com acesso ao catálogo e ao diretório de corretores. O cadastro profissional continua em `/cadastro`. O link Criar conta do cabeçalho abre o cadastro de cliente; o login oferece as duas opções.

Build e TypeScript passaram. A tela foi conferida no navegador. Nenhuma conta fictícia nem email de teste foi criado/enviado; o ciclo completo de confirmação e entrada de uma nova conta de cliente ainda precisa ser validado com um cadastro real feito pelo usuário. Nenhuma migração adicional é necessária.

Esta etapa prepara a identificação do cliente. O formulário de solicitação personalizada de imóvel e o envio de contatos ainda não estão implementados.
