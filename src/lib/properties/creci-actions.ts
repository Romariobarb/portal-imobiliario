"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./access";
import { brazilStates } from "./validation";
export async function recordCreciCheck(_: { error?: string; message?: string }, form: FormData): Promise<{ error?: string; message?: string }> {
 const { supabase } = await requireAdmin();
 const result=String(form.get("result")??""), registration_state=String(form.get("registration_state")??""), notes=String(form.get("notes")??"").trim();
 if (!["confirmed","not_found","mismatch"].includes(result) || !brazilStates.includes(registration_state) || notes.length<10 || notes.length>2000 || form.get("attestation")!=="on") return {error:"Consulte o conselho, selecione o resultado e registre os detalhes da conferência."};
 const {error}=await supabase.rpc("record_creci_check",{target_id:String(form.get("id")??""),expected_updated_at:String(form.get("updated_at")??""),expected_name:String(form.get("full_name")??""),result,registration_state,notes});
 if(error) return {error:error.code==="40001" ? "O cadastro mudou. Atualize a página e confira os dados novamente." : "Não foi possível registrar a conferência. Atualize a página e tente novamente."};
 revalidatePath("/admin");
 return {message:"Conferência registrada. A aprovação do corretor é uma etapa separada."};
}
