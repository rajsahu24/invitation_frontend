'use client';

import { useEffect, useRef, Suspense } from "react";
import { useHostStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const { login, user } = useHostStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        const urlToken = searchParams.get('token');
        console.log("AuthCallback received token:", urlToken ? "Present" : "Missing");
        if (urlToken) {
          console.log("Establishing session via BFF...");
          // Store token in HttpOnly cookie via BFF
          const sessionRes = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: urlToken })
          });
          
          if (!sessionRes.ok) {
            console.error("Failed to establish BFF session");
          }
        }

        const response = await fetch(
          `/api/auth/me`,
          { credentials: "include" }
        );

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const userData = await response.json();

        login({
          id: userData.id,
          name: userData.name || userData.displayName,
          email: userData.email,
        });
      } catch (error) {
        console.error("Callback execution error:", error);
        router.replace("/login");
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  // ✅ redirect AFTER state is set
  useEffect(() => {
    if (user) {
      router.replace("/host");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-medium">
        Loading authentication...
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
