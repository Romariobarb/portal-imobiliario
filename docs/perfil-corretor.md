# Apresentação profissional

`/dashboard/perfil` permite editar somente a biografia do cadastro de corretor ligado à identidade autenticada. O acesso depende de existir esse cadastro, inclusive para administrador que também tenha registro profissional. Clientes sem cadastro profissional voltam à sua área.

O formulário aceita até 2.000 caracteres e salva vazio como null. A ação nunca recebe identificação de outro corretor nem atualiza CRECI, nome ou status. A atualização exige profile_id da sessão verificada e updated_at original; ausência de linha atualizada informa conflito e exige recarregar. Após salvar, o formulário recebe o novo timestamp para permitir a próxima edição.

A biografia é texto simples, escapado pelo React, e o perfil público permanece restrito a corretores aprovados. Cadastros pendentes podem preparar a apresentação sem publicar o perfil. Não foi necessária alteração de banco: usa brokers.bio e as políticas existentes.

Build/TypeScript e diff check passaram. A tela carregou o cadastro real no navegador. Conforme pedido do usuário, a validação manual de salvar e visualizar um perfil aprovado ficou para a etapa de testes; nenhum texto fictício foi salvo no cadastro real.
