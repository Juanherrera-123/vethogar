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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "Missing profileId." }, { status: 400 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, is_public")
    .eq("id", profileId)
    .maybeSingle();

  if (!profile || !profile.is_public) {
    return NextResponse.json({ error: "Profile not available." }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ reviews: data ?? [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profileId = body?.profileId;
    const rating = Number(body?.rating);
    const comment = typeof body?.comment === "string" ? body.comment.trim() : "";

    if (!profileId || !comment || Number.isNaN(rating)) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    if (comment.length > 240) {
      return NextResponse.json({ error: "Comment too long." }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, is_public")
      .eq("id", profileId)
      .maybeSingle();

    if (!profile || !profile.is_public) {
      return NextResponse.json({ error: "Profile not available." }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        profile_id: profileId,
        rating,
        comment,
      })
      .select("id, rating, comment, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
