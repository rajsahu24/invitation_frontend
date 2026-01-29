"use client";

import { useEffect, useRef } from "react";
import { useHostStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const { login, user } = useHostStore();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        // Extract token from URL
        const searchParams = new URL(window.location.href).searchParams;
        const urlToken = searchParams.get('token');

        if (urlToken) {
          // Store token in HttpOnly cookie via BFF
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: urlToken })
          });
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
        console.error("Callback error:", error);
        router.replace("/login");
      }
    };

    handleCallback();
  }, []);

  // ✅ redirect AFTER state is set
  useEffect(() => {
    if (user) {
      router.replace("/host");
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
