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
    const { role, userId, email, vetProfile, clinicProfile } = body;

    if (!role || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (role !== "vet" && role !== "clinic") {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      role,
      email,
      status: "pending",
      is_public: false,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (role === "vet") {
      const { error: vetError } = await supabaseAdmin.from("vet_profiles").insert({
        id: userId,
        first_name: vetProfile?.firstName ?? null,
        last_name: vetProfile?.lastName ?? null,
        sex: vetProfile?.sex ?? null,
        age: vetProfile?.age ? Number(vetProfile.age) : null,
        phone: vetProfile?.phone ?? null,
        city: vetProfile?.city ?? null,
        address: null,
        about: null,
        professional_card_number: null,
        specialties: [],
        consultation_cost: null,
        hours: null,
        experience: null,
        university: null,
        languages: null,
        awards: null,
        publication_links: [],
        social_links: null,
      });

      if (vetError) {
        return NextResponse.json({ error: vetError.message }, { status: 400 });
      }
    }

    if (role === "clinic") {
      const { error: clinicError } = await supabaseAdmin.from("clinic_profiles").insert({
        id: userId,
        clinic_name: clinicProfile?.clinicName ?? null,
        professionals_count: null,
        city: clinicProfile?.city ?? null,
        address: null,
        first_name: null,
        last_name: null,
        sex: null,
        age: null,
        phone: clinicProfile?.phone ?? null,
        role: null,
        email,
        about: null,
        consultation_cost: null,
        hours: null,
        services: [],
        other_service: null,
      });

      if (clinicError) {
        return NextResponse.json({ error: clinicError.message }, { status: 400 });
      }
    }

    const { error: verificationError } = await supabaseAdmin
      .from("verification_requests")
      .insert({ profile_id: userId, status: "pending" });

    if (verificationError) {
      return NextResponse.json({ error: verificationError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
