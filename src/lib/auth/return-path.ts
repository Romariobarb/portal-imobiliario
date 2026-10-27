const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
export function safeReturnPath(value: unknown): string {
 if (typeof value !== "string") return "/dashboard";
 if (["/solicitar-imovel", "/dashboard/solicitacoes", "/dashboard", "/dashboard/contatos", "/dashboard/perfil", "/admin", "/dashboard/imoveis", "/dashboard/imoveis/novo"].includes(value)) return value;
 if (new RegExp(`^/(?:admin|dashboard)/imoveis/${uuid}$`, "i").test(value)) return value;
 if (/^\/imoveis\/[a-zA-Z0-9][a-zA-Z0-9_-]{0,199}\/contato$/.test(value)) return value;
 return "/dashboard";
}
