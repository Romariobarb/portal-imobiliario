"use server";

import { safeReturnPath } from "./return-path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };
const states = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));

export async function registerClient(_: AuthState, form: FormData): Promise<AuthState> {
  const full_name = String(form.get("full_name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (full_name.length < 3 || full_name.length > 150 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{10,13}$/.test(phone.replace(/\D/g, ""))) return { error: "Confira nome, email e telefone com DDD." };
  if (password.length < 8 || password.length > 128) return { error: "Use uma senha de 8 a 128 caracteres." };
  if (password !== String(form.get("confirm_password") ?? "")) return { error: "As senhas não coincidem." };
  const origin = (await headers()).get("origin");
  if (!origin) return { error: "Recarregue a página e tente novamente." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback`, data: { registration_kind: "client", full_name, phone } } });
  if (error) return { error: error.status === 429 || error.code === "over_email_send_rate_limit" ? "Aguarde alguns minutos antes de tentar novamente." : error.code === "weak_password" ? "Escolha uma senha mais forte." : "Não foi possível concluir o cadastro. Se já possui conta, tente entrar." };
  if (data.session) redirect("/dashboard");
  return { message: "Confira seu email para confirmar a conta. Se já possui cadastro, entre com seu email e senha." };
}

export async function registerBroker(_: AuthState, form: FormData): Promise<AuthState> {
  const value = (key: string) => String(form.get(key) ?? "").trim();
  const full_name = value("full_name"), email = value("email"), phone = value("phone");
  const creci = value("creci").toUpperCase(), city = value("city"), state = value("state");
  const password = String(form.get("password") ?? "");
  if (full_name.length < 3 || full_name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !/^\d{10,13}$/.test(phone.replace(/\D/g, "")) || creci.length < 3 || creci.length > 30 || city.length < 2 || city.length > 100 || !states.has(state)) {
    return { error: "Confira nome, email, telefone, CRECI, cidade e estado." };
  }
  if (password.length < 8 || password.length > 128) return { error: "Use uma senha de 8 a 128 caracteres." };
  if (password !== String(form.get("confirm_password") ?? "")) return { error: "As senhas não coincidem." };
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  if (!origin) return { error: "Não foi possível validar a origem do cadastro. Recarregue a página." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { emailRedirectTo: `${origin}/auth/callback`, data: { registration_kind: "broker", full_name, phone, creci, city, state } },
  });
  if (error) {
    if (error.status === 429) return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
    if (error.code === "weak_password") return { error: "Escolha uma senha mais forte." };
    if (error.code === "over_email_send_rate_limit") return { error: "O limite de emails foi atingido. Aguarde antes de tentar novamente." };
    if (error.code === "user_already_exists") return { error: "Não foi possível cadastrar. Se você já tem conta, entre com seu email." };
    return { error: "Não foi possível concluir o cadastro. Confira seus dados e CRECI ou tente novamente mais tarde." };
  }
  if (data.session) redirect("/dashboard");
  return { message: "Confira seu email para confirmar a conta. Se já possui cadastro, acesse Entrar. Após a confirmação, seu cadastro profissional ficará aguardando aprovação." };
}

export async function login(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim(), password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Informe email e senha." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.code === "email_not_confirmed" ? "Confirme seu email antes de entrar." : error.status === 429 ? "Muitas tentativas. Aguarde e tente novamente." : "Não foi possível entrar. Confira seu email e senha." };
  redirect(safeReturnPath(form.get("next")));
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Não foi possível sair. Tente novamente.");
  redirect("/login");
}

export async function resendConfirmation(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: "Informe um email válido." };
  const origin = (await headers()).get("origin");
  if (!origin) return { error: "Recarregue a página e tente novamente." };
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${origin}/auth/callback` } });
  if (error && (error.status === 429 || error.code === "over_email_send_rate_limit")) return { error: "Aguarde alguns minutos antes de solicitar outro email." };
  if (error && error.status && error.status >= 500) return { error: "Não foi possível enviar agora. Tente novamente em alguns instantes." };
  return { message: "Se esse email tem um cadastro aguardando confirmação, você receberá um novo link. Use o email mais recente. Se já confirmou a conta, entre com sua senha." };
}
