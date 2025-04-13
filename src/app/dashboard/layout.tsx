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

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}
