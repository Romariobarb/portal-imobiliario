"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, registerBroker, registerClient } from "@/lib/auth/actions";

const inputClass = "mt-2 w-full rounded-md border border-[#DCD8D0] bg-white px-4 py-3 text-[#0E1E3A]";
export default function AuthForm({ mode, returnPath = "/dashboard" }: { mode: "login" | "register" | "client"; returnPath?: string }) {
  const registration = mode !== "login";
  const brokerRegistration = mode === "register";
  const [state, action, pending] = useActionState(brokerRegistration ? registerBroker : registration ? registerClient : login, {});
  const fields = brokerRegistration ? [
    ["full_name", "Nome completo", "text", "name"], ["email", "Email", "email", "email"],
    ["phone", "Telefone com DDD", "tel", "tel"], ["creci", "CRECI (número e UF)", "text", "off"], ["city", "Cidade", "text", "address-level2"],
  ] : registration ? [["full_name", "Nome completo", "text", "name"], ["email", "Email", "email", "email"], ["phone", "Telefone com DDD", "tel", "tel"]] : [["email", "Email", "email", "email"]];
  return (
    <form action={action} className="space-y-5">
      {!registration && <input type="hidden" name="next" value={returnPath} />}
      {state.error && <p role="alert" className="rounded-md bg-red-50 p-4 text-red-800">{state.error}</p>}
      {state.message ? <div role="status" className="rounded-md bg-green-50 p-4 text-green-900">{state.message}</div> : <>
        <div className={registration ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
          {fields.map(([name, label, type, autoComplete]) => <label key={name} htmlFor={name} className="block text-sm font-medium">{label}<input id={name} name={name} type={type} autoComplete={autoComplete} required maxLength={name === "email" ? 254 : name === "full_name" ? 150 : name === "city" ? 100 : 30} className={inputClass} /></label>)}
          {brokerRegistration && <label htmlFor="state" className="block text-sm font-medium">Estado<select id="state" name="state" autoComplete="address-level1" required defaultValue="" className={inputClass}><option value="" disabled>Selecione a UF</option>{"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ").map(uf => <option key={uf}>{uf}</option>)}</select></label>}
          <label htmlFor="password" className="block text-sm font-medium">Senha<input id="password" name="password" type="password" autoComplete={registration ? "new-password" : "current-password"} required minLength={registration ? 8 : undefined} maxLength={128} className={inputClass} />{registration && <span className="mt-1 block text-xs text-[#57544F]">Pelo menos 8 caracteres.</span>}</label>
          {registration && <label htmlFor="confirm_password" className="block text-sm font-medium">Confirme a senha<input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} className={inputClass} /></label>}
        </div>
        <button disabled={pending} className="w-full rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Aguarde…" : brokerRegistration ? "Criar conta de corretor" : registration ? "Criar minha conta" : "Entrar"}</button>
      </>}
      {!registration && <p className="text-center text-sm"><Link href="/cadastro/cliente" className="font-semibold text-[#0E1E3A] underline">Criar conta para buscar imóveis</Link></p>}
      <p className="text-center text-sm text-[#57544F]">{registration ? "Já possui conta? " : "Ainda não possui conta? "}<Link className="font-semibold text-[#0E1E3A] underline" href={registration ? "/login" : "/cadastro"}>{registration ? "Entrar" : "Cadastre-se como corretor"}</Link></p>
    </form>
  );
}
