export const brazilStates = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
export const propertyTypes = ["Apartamento", "Casa", "Terreno", "Comercial", "Rural"];
export const propertyStatusLabels = { draft: "Rascunho", pending: "Em análise", approved: "Publicado", changes_requested: "Ajustes solicitados", rejected: "Não aprovado", archived: "Arquivado" };

export function validateListing(form: FormData) {
  const text = (key: string, min: number, max: number) => {
    const value = String(form.get(key) ?? "").trim();
    if (value.length < min || value.length > max) throw new Error(`Confira o campo ${key === "title" ? "título" : key === "description" ? "descrição" : key === "city" ? "cidade" : "bairro"}.`);
    return value;
  };
  const numeric = (key: string, max: number, integer = false, optional = false) => {
    const raw = String(form.get(key) ?? "").trim();
    if (optional && !raw) return null;
    const value = Number(raw.replace(",", "."));
    if (!raw || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) throw new Error("Confira os valores e as quantidades do imóvel.");
    return value;
  };
  const operation = String(form.get("operation_type") ?? ""), type = String(form.get("property_type") ?? ""), state = String(form.get("state") ?? "");
  if (!['sale', 'rent'].includes(operation) || !propertyTypes.includes(type) || !brazilStates.includes(state)) throw new Error("Selecione a finalidade, o tipo de imóvel e o estado.");
  const bedrooms = numeric("bedrooms", 100, true)!, suites = numeric("suites", 100, true)!;
  if (suites > bedrooms) throw new Error("O número de suítes não pode superar o número de quartos.");
  const images = String(form.get("images") ?? "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (images.length > 20 || new Set(images).size !== images.length) throw new Error("Informe até 20 fotos, sem repetir os links.");
  for (const image of images) {
    try { const url = new URL(image); if (url.protocol !== "https:" || url.username || url.password || image.length > 2000) throw new Error(); }
    catch { throw new Error("Cada foto precisa de um link HTTPS válido."); }
  }
  const features = String(form.get("features") ?? "").split(",").map(s => s.trim()).filter(Boolean);
  if (features.length > 30 || features.some(s => s.length > 100)) throw new Error("Informe até 30 características com até 100 caracteres cada.");
  const address = String(form.get("address") ?? "").trim();
  if (address.length > 300) throw new Error("O endereço deve ter até 300 caracteres.");
  return { operation_type: operation, property_type: type, title: text("title", 3, 150), description: text("description", 10, 10000), price: numeric("price", 999999999999.99)!, city: text("city", 2, 100), state, neighborhood: text("neighborhood", 2, 100), address: address || null, area: numeric("area", 9999999999.99)!, bedrooms, suites, bathrooms: numeric("bathrooms", 100, true)!, parking_spaces: numeric("parking_spaces", 100, true)!, condominium_fee: numeric("condominium_fee", 999999999999.99, false, true), property_tax: numeric("property_tax", 999999999999.99, false, true), features, images };
}
