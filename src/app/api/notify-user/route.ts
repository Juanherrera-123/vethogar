import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const resendKey = process.env.RESEND_API_KEY || "";
const resendFrom = process.env.RESEND_FROM || "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function POST(request: Request) {
  try {
    if (!resendKey) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }
    if (!resendFrom) {
      return NextResponse.json({ error: "Missing RESEND_FROM" }, { status: 500 });
    }

    const { profileId, message } = await request.json();
    if (!profileId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, role")
      .eq("id", profileId)
      .maybeSingle();

    if (!profile?.email) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";
    const profileUrl = origin ? `${origin}/soy-veterinario` : "";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Se requieren cambios en tu perfil</h2>
        <p>El equipo de Vethogar reviso tu perfil y necesita ajustes antes de aprobarlo.</p>
        <p><strong>Mensaje:</strong> ${message}</p>
        ${profileUrl ? `<p><a href="${profileUrl}">Ir al perfil</a></p>` : ""}
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom,
        to: profile.email,
        subject: "Necesitamos ajustes en tu perfil",
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json({ error: body }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
