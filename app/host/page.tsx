import InvitationList from "@/core/components/host/InvitationList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getInvitations(token: string) {
  try {
    console.log("Helllo")
    // 1. Get User ID using token provided in headers
    // We assume there is an endpoint /api/auth/me or similar that returns user info based on cookie/token
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/auth/me`, {
       headers: { 
         'Authorization': `Bearer ${token}`
       },
       cache: 'no-store'
    });
    
    if (userRes.ok) {
       const userData = await userRes.json();
       const userId = userData.user?.id || userData.id;

       if (userId) {
         // 2. Get Invitations
         const invRes = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations/user/${userId}`, {
              headers: { 
                'Authorization': `Bearer ${token}`
              },
              cache: 'no-store'
         });
         
         if (invRes.ok) {
             return await invRes.json();
         }
       }
    }
    
  } catch (e) {
      console.error("Server fetch error", e);
  }
  return [];
}

export default async function HostPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const invitations = await getInvitations(token);

  return (
    <InvitationList initialInvitations={invitations} />
  );
}
