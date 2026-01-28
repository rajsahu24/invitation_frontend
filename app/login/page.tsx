import HostLoginPage from "@/core/components/host/HostLoginPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/me`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );
  if (res.ok) {
    redirect("/host");
  }

  return <HostLoginPage />;
}
