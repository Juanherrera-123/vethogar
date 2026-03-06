import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const resendKey = process.env.RESEND_API_KEY || "";
const resendFrom = process.env.RESEND_FROM || "";
const masterEmail = process.env.MASTER_EMAIL || "juansebastianherrera0210@gmail.com";

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

    const { profileId } = await request.json();
    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, role")
      .eq("id", profileId)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let displayName = profile.email;
    let city = "";

    if (profile.role === "vet") {
      const { data } = await supabaseAdmin
        .from("vet_profiles")
        .select("first_name, last_name, city")
        .eq("id", profileId)
        .maybeSingle();
      if (data) {
        displayName = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || displayName;
        city = data.city ?? "";
      }
    }

    if (profile.role === "clinic") {
      const { data } = await supabaseAdmin
        .from("clinic_profiles")
        .select("clinic_name, city")
        .eq("id", profileId)
        .maybeSingle();
      if (data) {
        displayName = data.clinic_name ?? displayName;
        city = data.city ?? "";
      }
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";
    const detailUrl = origin ? `${origin}/admin/solicitudes?review=${encodeURIComponent(profileId)}` : "";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Nuevo perfil pendiente</h2>
        <p>Se ha enviado un perfil para aprobacion.</p>
        <p><strong>Tipo:</strong> ${profile.role}</p>
        <p><strong>Nombre:</strong> ${displayName}</p>
        <p><strong>Ciudad:</strong> ${city || "-"}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        ${detailUrl ? `<p><a href="${detailUrl}">Ver detalle en el panel</a></p>` : ""}
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
        to: masterEmail,
        subject: "Nuevo perfil pendiente de aprobacion",
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
