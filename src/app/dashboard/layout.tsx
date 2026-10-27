import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!await getCurrentProfile()) redirect("/login");
  return children;
}
