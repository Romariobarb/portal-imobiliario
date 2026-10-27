"use server";
import {getCurrentProfile} from "@/lib/auth/session";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
export type SearchRequestState={error?:string;message?:string};
export async function sendSearchRequest(_:SearchRequestState,form:FormData):Promise<SearchRequestState>{
 const profile=await getCurrentProfile();
 if(!profile || profile.role!=="client")return {error:"Entre com sua conta de cliente para solicitar um imóvel."};
 const value=(key:string)=>String(form.get(key)??"").trim();
 const operation=value("operation_type"),property_type=value("property_type"),city=value("city"),state=value("state"),message=value("message");
 const budget=Number(value("budget")),bedrooms=Number(value("bedrooms"));
 if(!['sale','rent'].includes(operation)||property_type.length<2||property_type.length>80||city.length<2||city.length>100||!"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(' ').includes(state)||!Number.isFinite(budget)||budget<=0||budget>1e12||!value('bedrooms')||!Number.isInteger(bedrooms)||bedrooms<0||bedrooms>100||message.length<10||message.length>5000)return {error:"Confira localização, orçamento, quartos e descrição (10 a 5.000 caracteres)."};
 const supabase=await createClient();
 const {error}=await supabase.from('property_search_requests').insert({client_id:profile.id,operation_type:operation as 'sale'|'rent',property_type,city,state,budget,bedrooms,message});
 if(error)return {error:"Não foi possível enviar sua solicitação. Tente novamente mais tarde."};
 revalidatePath('/dashboard/solicitacoes');
 return {message:"Solicitação enviada à equipe Astro. Você pode consultar o registro na sua área."};
}
