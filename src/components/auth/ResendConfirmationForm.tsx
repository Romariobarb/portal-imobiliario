"use client";
import { useActionState } from "react";
import { resendConfirmation } from "@/lib/auth/actions";

export default function ResendConfirmationForm() {
  const [state, action, pending] = useActionState(resendConfirmation, {});
  return <details className="mt-6 border-t border-[#DCD8D0] pt-5"><summary className="cursor-pointer text-sm font-medium text-[#0E1E3A]">Não recebeu o email de confirmação?</summary><form action={action} className="mt-4 space-y-3">{state.error && <p role="alert" className="text-sm text-red-800">{state.error}</p>}{state.message && <p role="status" className="text-sm text-green-800">{state.message}</p>}<label htmlFor="confirmation_email" className="block text-sm">Email cadastrado<input id="confirmation_email" name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 w-full rounded-md border border-[#DCD8D0] px-4 py-3" /></label><button disabled={pending} className="rounded-md border border-[#0E1E3A] px-4 py-3 text-sm font-semibold text-[#0E1E3A] disabled:opacity-50">{pending ? "Aguarde…" : "Reenviar confirmação"}</button></form></details>;
}
