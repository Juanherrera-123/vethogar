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

type ContactAction = "whatsapp" | "call";
type ContactSource = "directory_card" | "profile_header" | "profile_service";

const allowedActions = new Set<ContactAction>(["whatsapp", "call"]);
const allowedSources = new Set<ContactSource>(["directory_card", "profile_header", "profile_service"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profileId = typeof body?.profileId === "string" ? body.profileId.trim() : "";
    const action = typeof body?.action === "string" ? body.action.trim() : "";
    const source = typeof body?.source === "string" ? body.source.trim() : "";

    if (!profileId || !allowedActions.has(action as ContactAction) || !allowedSources.has(source as ContactSource)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, is_public")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (!profile || !profile.is_public) {
      return NextResponse.json({ error: "Profile not available." }, { status: 404 });
    }

    const { error } = await supabaseAdmin.from("contact_click_events").insert({
      profile_id: profileId,
      action,
      source,
    });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Metrics table is not configured yet.", setupRequired: true },
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
