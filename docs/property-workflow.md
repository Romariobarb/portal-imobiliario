# Cadastro e revisão de imóveis

Implementação de 7 de outubro de 2026. Migração `202610070003_property_workflow.sql` aplicada pelo SQL Editor ao projeto `jnutgaczakhewkkhqawx`.

## Fluxo profissional

Corretor aprovado acessa `/dashboard/imoveis`. Pode cadastrar um imóvel, salvar rascunho ou enviar para análise. Imóveis em análise não podem ser editados. Ajustes solicitados liberam a edição e novo envio. Publicados, rejeitados e arquivados são exibidos em modo de consulta.

O formulário inclui finalidade, tipo, título, cidade/UF, bairro, endereço, preço, área, quartos, suítes, banheiros, vagas, condomínio, IPTU, descrição, características e até 20 fotos enviadas diretamente em JPG, PNG ou WebP, de até 6 MB cada. É possível escolher a capa e remover fotos do anúncio antes de salvar. Envio para análise requer ao menos uma foto. Links HTTPS existentes permanecem compatíveis.

`save_listing` usa SECURITY INVOKER e mantém RLS. Valida o corretor aprovado, a propriedade do registro e seu status; salva imóvel, fotos e envio na mesma transação. Timestamp protege contra sobrescrita de edições em outra aba. Dados de identidade, slug, status e publicação enviados no payload não podem substituir os campos controlados pelo banco.

## Administração

`/admin` e cada ação verificam a identidade e o papel de administrador no servidor. `moderate_listing` também exige administrador no banco. Aprovação de corretor e papel profissional são atualizados em uma transação, preservando papel de administrador em contas que também são corretores.

Imóveis pendentes podem ser aprovados, receber solicitação de ajustes ou ser recusados. Aprovação exige corretor aprovado e foto. Publicados podem ser arquivados. Recusa, ajustes e suspensão exigem motivo. Status esperado evita revisar um registro já alterado. Histórico fica em `moderation_events`, protegido por RLS e visível ao administrador e ao corretor responsável. A fila mantém corretores cadastrados e imóveis pendentes/publicados.

O primeiro administrador não é criado automaticamente. Uma conta real e confirmada deverá ser explicitamente indicada e autorizada pelo usuário antes de receber esse papel. Em 7 de outubro de 2026, após autorização explícita do usuário, a conta confirmada Romario Barbosa recebeu o papel admin pelo SQL Editor. A operação exigiu exatamente uma conta confirmada com esse nome e não alterou o status profissional do corretor. Acesso autenticado a /admin conferido pela interface.

## Catálogo

Home, `/imoveis` e `/imoveis/[slug]` consultam o Supabase. Somente imóveis aprovados de corretores aprovados são apresentados, mesmo se quem consulta estiver autenticado. Fotos, descrição, valores e características são reais; os exemplos em `src/data/properties.ts` permanecem no projeto, mas não são exibidos como anúncios reais. O corretor público é identificado pelo CRECI; dados privados do perfil não são expostos. O formulário demonstrativo de contato foi removido do detalhe; contatos e solicitações serão integrados em outra etapa.

## Verificação

- Build e TypeScript passaram. `git diff --check` sem erros.
- Rotas públicas respondem 200; cadastro de imóveis e administração sem sessão redirecionam ao login; anúncio inexistente retorna 404.
- Validações do formulário verificadas para números negativos, vazios, não finitos, frações em contagens, suítes acima de quartos, estado/finalidade inválidos, excesso e protocolos das fotos.
- `supabase/tests/property_workflow.sql` executa testes no banco e usa rollback: envio, bloqueio de edição durante análise, autoaprovação, privacidade, ajustes, concorrência, troca de fotos atômica, isolamento de corretores, publicação, suspensão e histórico.

Nenhum usuário ou anúncio de teste permanente é necessário. A validação do fluxo autenticado pela interface depende do cadastro da conta real inicial.

Referências: https://supabase.com/docs/guides/database/functions e https://supabase.com/docs/guides/database/postgres/row-level-security.

## Fotos no Storage

Migração 202610070004_property_photos.sql aplicada ao Supabase real. Bucket property-photos privado, sem políticas de substituição ou exclusão. Upload direto usa sessão do corretor aprovado e pasta própria; bucket restringe tamanho e MIME. Prévia verifica que o navegador consegue decodificar a imagem. Rascunhos são visíveis apenas ao dono e à administração. Fotos vinculadas a anúncios aprovados de corretores aprovados podem receber URL assinada por 5 minutos para o catálogo; retirada de publicação/suspensão impede novas assinaturas, e links já emitidos expiram nesse intervalo. A referência estável é salva no banco, nunca o link temporário.

Remover na interface desvincula ao salvar, sem apagar permanentemente o arquivo. Fotos enviadas sem salvar o formulário permanecem privadas no Storage; limpeza de arquivos sem vínculo ainda não foi implementada. Limite de 20 é por formulário/anúncio, não uma cota total por corretor.

Teste transacional property_photos.sql no banco real passou: dono lê seu envio, outro corretor não lê foto privada, corretor pendente não envia, visitante não lê pendente, publicado é legível e suspensão oculta novamente. Todos os registros de teste revertidos. Build/TypeScript e diff check passaram. Envio de um arquivo real pela interface ainda depende de um corretor aprovado; a conta inicial segue com cadastro profissional pendente, sem aprovação automática do CRECI.

## Revisão detalhada

Em 9 de outubro de 2026, /admin/imoveis/[id] passou a reunir fotos, todos os campos do imóvel, corretor responsável, decisão e histórico com responsável/data/motivo. A fila mantém um resumo e abre a revisão, onde ocorrem as decisões. Rascunhos e estados sem decisão disponível são consultáveis por administrador sem ações indevidas.

Cada página administrativa e cada ação verificam acesso no servidor. O layout só organiza os filhos, para o guard da página preservar seu destino exato. Ao abrir link de revisão sem sessão, o login recebe next e preserva apenas destinos locais permitidos, incluindo IDs válidos. URLs externas, caminhos arbitrários e parâmetros adicionais são descartados. Após login, a página de destino verifica novamente a permissão administrativa. As futuras notificações poderão usar essa rota; emails ainda não são enviados.

Build/TypeScript e diff check passaram. Testes de redirecionamento verificaram proteção anônima, preservação do destino permitido e descarte de URL externa. Conferência visual autenticada não concluída nesta etapa: leitura da aba foi bloqueada pela política do navegador. Não foram criados anúncios reais para teste.
