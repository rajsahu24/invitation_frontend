import HostLoginPage from "@/core/components/host/HostLoginPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <HostLoginPage />;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/me`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: "no-store",
    }
  );

  if (res.ok) {
    redirect("/host");
  }

  return <HostLoginPage />;
}
