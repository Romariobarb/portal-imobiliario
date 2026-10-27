# Publicação Vercel — 27 de outubro de 2026

Projeto existente ghoma-tower/portal-imobiliario vinculado ao diretório local. Publicação direta pela CLI, sem commit/push. Variáveis públicas NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY configuradas em preview e production. Nenhuma service role enviada.

Deploy dpl_A8vbC3461pkaYmDwozZjV4yHsruA concluído com estado READY. Endereço estável: https://portal-imobiliario-sable.vercel.app. Arquivos .env, histórico Git, dependências, documentação, migrations e cópia aninhada antiga excluídos do upload. Regras de exclusão ancoradas na raiz para preservar src/lib/supabase.

Verificação anônima: /construtora e /login retornam 200, /dashboard redireciona ao login. / e /imoveis retornam 500 por falha de consulta ao Supabase. O hostname jnutgaczakhewkkhqawx.supabase.co retorna nome DNS inexistente na verificação local. É necessário conferir o projeto no painel; não foi confirmado se está pausado, removido ou com outra indisponibilidade.

A sessão do painel Supabase expirou. Solicitado ao usuário entrar novamente para conferir disponibilidade e configurar os redirects de confirmação/recuperação com o domínio online. Essas configurações ainda não foram alteradas. Não apresentar a publicação como totalmente funcional até corrigir o backend e repetir os testes de catálogo e autenticação.


## Recuperação após novo login

Projeto confirmado como pausado no painel. Resume project executado, sem upgrade de plano e sem alterações de dados/permissões. O DNS voltou, mas a API segue retornando 521 durante a recuperação. Após alguns minutos, o painel passou a mostrar Restoration in progress e informa que a operação pode levar de minutos a várias horas; o projeto fica offline durante esse período. A configuração de URLs de autenticação ainda está indisponível.

Próxima ação após a recuperação: Site URL https://portal-imobiliario-sable.vercel.app; acrescentar redirects exatos /auth/callback e /auth/recuperacao desse domínio, preservando os locais; testar home, catálogo, corretores e proteção das áreas restritas sem criar contas ou enviar emails. Não é necessário republicar o código para a API voltar, salvo se surgirem novos erros.
