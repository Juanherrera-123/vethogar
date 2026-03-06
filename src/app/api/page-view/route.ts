import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const path = typeof body?.path === "string" ? body.path.trim() : "";
    const profileId = typeof body?.profileId === "string" ? body.profileId.trim() : null;
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer.trim() : null;

    if (!path || !path.startsWith("/") || !sessionId) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("page_view_events").insert({
      path,
      profile_id: profileId || null,
      session_id: sessionId,
      referrer: referrer || null,
    });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Page-view table is not configured yet.", setupRequired: true },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
