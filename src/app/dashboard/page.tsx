"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectByRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      const user = session?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      const roleResponse = await fetch("/api/auth-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: "{}",
      });

      if (!roleResponse.ok) {
        router.replace("/login");
        return;
      }

      const rolePayload = await roleResponse.json();
      const role = rolePayload?.role as string | null;

      if (role === "master" || role === "admin") {
        router.replace("/admin");
        return;
      }

      if (role === "vet" || role === "clinic") {
        router.replace("/soy-veterinario");
        return;
      }

      router.replace("/directorio");
    };

    redirectByRole();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pt-32 pb-12 flex items-center justify-center">
      <p className="text-sm text-gray-600">Redirigiendo...</p>
    </div>
  );
}
