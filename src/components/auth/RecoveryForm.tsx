"use client";
import {useActionState} from "react";
import Link from "next/link";
import {requestRecovery,updatePassword} from "@/lib/auth/recovery-actions";
export default function RecoveryForm({reset=false}:{reset?:boolean}){
 const [state,action,pending]=useActionState(reset?updatePassword:requestRecovery,{});
 const input="mt-2 w-full rounded-md border border-[#DCD8D0] px-4 py-3";
 return <form action={action} className="mt-7 space-y-5">{state.error&&<p role="alert" className="rounded-md bg-red-50 p-4 text-red-800">{state.error}</p>}{state.message?<div role="status"><p className="rounded-md bg-green-50 p-4 text-green-900">{state.message}</p><Link href={reset?"/dashboard":"/login"} className="mt-5 inline-block font-semibold underline">{reset?"Abrir minha área":"Voltar ao login"}</Link></div>:<>{reset?<><label className="block">Nova senha<input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={input}/></label><label className="block">Confirme a nova senha<input name="confirm_password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={input}/></label></>:<label className="block">Email cadastrado<input name="email" type="email" required maxLength={254} autoComplete="email" className={input}/></label>}<button disabled={pending} className="w-full rounded-md bg-[#0E1E3A] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending?"Aguarde…":reset?"Salvar nova senha":"Enviar link de recuperação"}</button></>}</form>;
}
