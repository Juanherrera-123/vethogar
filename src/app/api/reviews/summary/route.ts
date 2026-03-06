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

interface ReviewRow {
  profile_id: string;
  rating: number | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawProfileIds = Array.isArray(body?.profileIds) ? body.profileIds : [];
    const profileIds = rawProfileIds
      .filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
      .map((item: string) => item.trim());

    if (profileIds.length === 0) {
      return NextResponse.json({ summaries: {} });
    }

    if (profileIds.length > 300) {
      return NextResponse.json({ error: "Too many profileIds." }, { status: 400 });
    }

    const uniqueIds = Array.from(new Set(profileIds));

    const { data: publicProfiles, error: publicProfilesError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("id", uniqueIds)
      .eq("is_public", true);

    if (publicProfilesError) {
      return NextResponse.json({ error: publicProfilesError.message }, { status: 400 });
    }

    const publicIds = (publicProfiles ?? []).map((item) => item.id);
    if (publicIds.length === 0) {
      return NextResponse.json({ summaries: {} });
    }

    const { data: reviewRows, error: reviewsError } = await supabaseAdmin
      .from("reviews")
      .select("profile_id, rating")
      .in("profile_id", publicIds);

    if (reviewsError) {
      return NextResponse.json({ error: reviewsError.message }, { status: 400 });
    }

    const grouped = new Map<string, { total: number; count: number }>();
    (reviewRows as ReviewRow[] | null)?.forEach((row) => {
      const rating = Number(row.rating) || 0;
      const prev = grouped.get(row.profile_id) ?? { total: 0, count: 0 };
      grouped.set(row.profile_id, { total: prev.total + rating, count: prev.count + 1 });
    });

    const summaries: Record<string, { averageRating: number; reviewCount: number }> = {};
    publicIds.forEach((profileId) => {
      const stat = grouped.get(profileId);
      if (!stat || stat.count === 0) {
        summaries[profileId] = { averageRating: 0, reviewCount: 0 };
        return;
      }
      summaries[profileId] = {
        averageRating: Number((stat.total / stat.count).toFixed(1)),
        reviewCount: stat.count,
      };
    });

    return NextResponse.json({ summaries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
