import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paths = Array.isArray(body?.paths) ? body.paths : [];
    const cleaned = paths
      .filter((item: unknown): item is string => typeof item === "string")
      .map((item: string) => item.trim())
      .filter(Boolean);

    if (cleaned.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabaseAdmin.storage
      .from("profile-uploads")
      .remove(cleaned);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
