import "server-only";
import { displayPhotos } from "./photo-display";
import { createClient } from "@/lib/supabase/server";
import type { Property as Listing, PropertyImage } from "@/types/domain";
export type CatalogProperty = Listing & { type: string; parking: number; image: string; agent: { name: string; creci: string }; images: PropertyImage[] };
export async function getPublicProperties(brokerId?: string): Promise<CatalogProperty[]> {
  const supabase = await createClient();
  let query = supabase.from("properties").select("*, brokers!inner(creci,status), property_images(*)").eq("status", "approved").eq("brokers.status", "approved").order("published_at", { ascending: false });
  if (brokerId) query = query.eq("broker_id", brokerId);
  const { data, error } = await query;
  if (error) throw new Error("Não foi possível carregar os imóveis. Tente novamente em alguns instantes.");
  return Promise.all((data ?? []).map(async p => {
    const images = await displayPhotos(supabase, [...p.property_images].sort((a,b) => a.position-b.position));
    return { ...p, type: p.operation_type === "sale" ? "Venda" : "Aluguel", parking: p.parking_spaces, image: images[0]?.url ?? "", agent: { name: "Corretor Astro", creci: p.brokers.creci }, images };
  }));
}
