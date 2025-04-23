import "../globals.css";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardWrapper from "./dashboardWrapper";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // 1) Si no hay sesión → login
  if (!session) {
    redirect("/login");
  }

  // 2) Si no verificó su email → check-email
  if (!session.user.emailVerified) {
    redirect("/check-email");
  }
  // 3) Si no es admin → forbidden
  if (session.user.role !== "admin") {
    redirect("/403");
  }

  return (
    <div>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}
