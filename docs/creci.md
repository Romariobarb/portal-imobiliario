# Conferência manual de CRECI

Implementada em 8 de outubro de 2026. Migração 202610080001_creci_checks.sql aplicada ao Supabase real. O painel /admin oferece acesso ao conselho de MG e formulário com UF de inscrição (separada da residência), resultado, observação e declaração de consulta oficial realizada.

Só administradores podem registrar uma conferência pelo RPC record_creci_check. Número, nome, responsável e data são obtidos pelo servidor/banco, sem confiar nesses campos enviados pelo navegador. Há controle de alteração do cadastro. Históricos são imutáveis para clientes autenticados; leitura permitida ao administrador e ao corretor responsável, sem acesso anônimo ou de outros corretores.

A aprovação de corretor exige a última conferência confirmada, correspondente ao número e nome atuais. Trigger protege também chamadas diretas ao banco. Registrar conferência não aprova automaticamente. Divergência ou número não localizado bloqueiam nova aprovação. A verificação não consulta uma API do conselho, não atesta autenticidade automaticamente, nem substitui a análise humana de identidade/situação. Nenhum CRECI real foi marcado como confirmado nos testes.

Cadastros anteriormente aprovados não são rebaixados automaticamente. Mudanças posteriores de nome/CRECI ou resultado de conferência não suspendem sozinhas uma conta já aprovada: o administrador deve revisar e suspender quando necessário. A próxima aprovação/reaprovação exige dados correspondentes.

Testes creci_checks.sql passaram no banco com rollback: ausência de conferência, resultado não localizado, conflito de edição, tentativa de autoverificação, privacidade, mudança de nome e aprovação após conferência fictícia. Testes existentes de imóveis e fotos foram adaptados para incluir conferências fictícias nos fixtures e reexecutados. Build/TypeScript e git diff --check passaram.

Fonte oficial de consulta: https://www.crecimg.gov.br/ (Consulta de Corretor). Para outras UFs, usar o conselho correspondente.
