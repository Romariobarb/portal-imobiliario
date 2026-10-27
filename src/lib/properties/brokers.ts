import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function getPublicBrokers() {
 const supabase=await createClient();
 const [brokers,properties]=await Promise.all([
  supabase.from("brokers").select("id,creci,city,state,bio").eq("status","approved").order("city").order("creci"),
  supabase.from("properties").select("broker_id,brokers!inner(status)").eq("status","approved").eq("brokers.status","approved"),
 ]);
 if(brokers.error || properties.error) throw new Error("Não foi possível carregar os corretores. Tente novamente em alguns instantes.");
 const counts=new Map<string,number>();
 for(const property of properties.data??[]) counts.set(property.broker_id,(counts.get(property.broker_id)??0)+1);
 return (brokers.data??[]).map(broker=>({...broker,publishedCount:counts.get(broker.id)??0}));
}
