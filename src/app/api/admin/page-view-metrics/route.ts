import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

type MetricsRange = "7d" | "30d" | "1m" | "1y";

interface PageViewRow {
  path: string;
  profile_id: string | null;
  session_id: string;
}

interface ProfileNameInfo {
  id: string;
  role: string;
  email: string;
}

const isValidRange = (value: string): value is MetricsRange =>
  value === "7d" || value === "30d" || value === "1m" || value === "1y";

const resolveStartDate = (range: MetricsRange) => {
  const now = new Date();
  if (range === "7d") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  if (range === "30d") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  if (range === "1m") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
};

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: requesterProfile, error: requesterError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (requesterError) {
      return NextResponse.json({ error: requesterError.message }, { status: 400 });
    }

    if (!requesterProfile || (requesterProfile.role !== "admin" && requesterProfile.role !== "master")) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rawRange = (searchParams.get("range") || "7d").trim();
    const range: MetricsRange = isValidRange(rawRange) ? rawRange : "7d";
    const startDate = resolveStartDate(range);

    const { data: views, error: viewsError } = await supabaseAdmin
      .from("page_view_events")
      .select("path, profile_id, session_id")
      .gte("created_at", startDate.toISOString());

    if (viewsError) {
      if (viewsError.code === "42P01") {
        return NextResponse.json(
          { error: "Page-view table is not configured yet.", setupRequired: true },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: viewsError.message }, { status: 400 });
    }

    const rows = (views ?? []) as PageViewRow[];
    const totalViews = rows.length;
    const uniqueSessions = new Set(rows.map((row) => row.session_id)).size;

    const pathStats = new Map<string, { views: number; sessions: Set<string> }>();
    const profileStats = new Map<string, { views: number; sessions: Set<string> }>();

    rows.forEach((row) => {
      const pathEntry = pathStats.get(row.path) ?? { views: 0, sessions: new Set<string>() };
      pathEntry.views += 1;
      pathEntry.sessions.add(row.session_id);
      pathStats.set(row.path, pathEntry);

      if (row.profile_id) {
        const profileEntry = profileStats.get(row.profile_id) ?? { views: 0, sessions: new Set<string>() };
        profileEntry.views += 1;
        profileEntry.sessions.add(row.session_id);
        profileStats.set(row.profile_id, profileEntry);
      }
    });

    const topPaths = Array.from(pathStats.entries())
      .map(([path, stats]) => ({ path, views: stats.views, unique_sessions: stats.sessions.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const rawTopProfiles = Array.from(profileStats.entries())
      .map(([profileId, stats]) => ({
        profile_id: profileId,
        views: stats.views,
        unique_sessions: stats.sessions.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const namesById: Record<string, string> = {};
    const rolesById: Record<string, string> = {};
    const topProfileIds = rawTopProfiles.map((item) => item.profile_id);

    if (topProfileIds.length > 0) {
      const { data: profileRows } = await supabaseAdmin
        .from("profiles")
        .select("id, role, email")
        .in("id", topProfileIds);

      const basicProfiles = (profileRows ?? []) as ProfileNameInfo[];
      const vetIds = basicProfiles.filter((item) => item.role === "vet").map((item) => item.id);
      const clinicIds = basicProfiles.filter((item) => item.role === "clinic").map((item) => item.id);

      basicProfiles.forEach((item) => {
        namesById[item.id] = item.email;
        rolesById[item.id] = item.role;
      });

      if (vetIds.length > 0) {
        const { data: vets } = await supabaseAdmin
          .from("vet_profiles")
          .select("id, first_name, last_name")
          .in("id", vetIds);
        (vets ?? []).forEach((vet) => {
          const firstName = typeof vet.first_name === "string" ? vet.first_name : "";
          const lastName = typeof vet.last_name === "string" ? vet.last_name : "";
          const fullName = `${firstName} ${lastName}`.trim();
          if (fullName) {
            namesById[vet.id] = fullName;
          }
        });
      }

      if (clinicIds.length > 0) {
        const { data: clinics } = await supabaseAdmin
          .from("clinic_profiles")
          .select("id, clinic_name")
          .in("id", clinicIds);
        (clinics ?? []).forEach((clinic) => {
          if (typeof clinic.clinic_name === "string" && clinic.clinic_name.trim()) {
            namesById[clinic.id] = clinic.clinic_name;
          }
        });
      }
    }

    return NextResponse.json({
      range,
      summary: {
        totalViews,
        uniqueSessions,
      },
      topPaths,
      topProfiles: rawTopProfiles.map((item) => ({
        ...item,
        name: namesById[item.profile_id] ?? item.profile_id,
        role: rolesById[item.profile_id] ?? "unknown",
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
