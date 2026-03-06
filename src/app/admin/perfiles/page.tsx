"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, Users } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { supabase } from "@/lib/supabase/client";

interface ProfileRow {
  id: string;
  email: string | null;
  role: "vet" | "clinic" | string;
  status?: string | null;
}

type StatusOption = "pending" | "approved" | "rejected" | "changes_requested";

const statusOptions: StatusOption[] = [
  "pending",
  "approved",
  "rejected",
  "changes_requested",
];

export default function AdminPerfilesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});
  const [adminName, setAdminName] = useState("Admin");
  const [savingId, setSavingId] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => profiles.filter((p) => p.status === "pending").length,
    [profiles],
  );

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const inferredName = (user.user_metadata?.full_name as string | undefined) ?? "";
      setAdminName(inferredName.trim() || "Admin");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      if (profileData?.role !== "master" && profileData?.role !== "admin") {
        setIsMaster(false);
        setLoading(false);
        return;
      }

      setIsMaster(true);

      const { data: profileRows, error: listError } = await supabase
        .from("profiles")
        .select("id, email, role, status")
        .in("role", ["vet", "clinic"])
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (listError) {
        setError(listError.message);
        setLoading(false);
        return;
      }

      const rows = (profileRows ?? []) as ProfileRow[];
      setProfiles(rows);

      const vetIds = rows.filter((p) => p.role === "vet").map((p) => p.id);
      const clinicIds = rows.filter((p) => p.role === "clinic").map((p) => p.id);
      const nextNames: Record<string, string> = {};

      if (vetIds.length > 0) {
        const { data: vets } = await supabase
          .from("vet_profiles")
          .select("id, first_name, last_name, profile_photo_url, image_url")
          .in("id", vetIds);
        (vets ?? []).forEach((v) => {
          const name = `${v.first_name ?? ""} ${v.last_name ?? ""}`.trim();
          nextNames[v.id] = name;
          const imageUrl = v.profile_photo_url ?? v.image_url;
          if (imageUrl) {
            setProfileImages((prev) => ({ ...prev, [v.id]: imageUrl }));
          }
        });
      }

      if (clinicIds.length > 0) {
        const { data: clinics } = await supabase
          .from("clinic_profiles")
          .select("id, clinic_name, logo_url")
          .in("id", clinicIds);
        (clinics ?? []).forEach((c) => {
          nextNames[c.id] = c.clinic_name ?? "";
          if (c.logo_url) {
            setProfileImages((prev) => ({ ...prev, [c.id]: c.logo_url }));
          }
        });
      }

      setDisplayNames(nextNames);
      setLoading(false);
    };

    init();
  }, [router]);

  const handleStatusChange = async (profileId: string, nextStatus: StatusOption) => {
    setError(null);
    setSavingId(profileId);

    const updates: Record<string, unknown> = {
      status: nextStatus,
      is_public: nextStatus === "approved",
      approved_at: nextStatus === "approved" ? new Date().toISOString() : null,
    };

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId);

    if (updateError) {
      setError(updateError.message);
      setSavingId(null);
      return;
    }

    if (nextStatus !== "approved") {
      const now = new Date().toISOString();
      const { data: existingRequest, error: requestFetchError } = await supabase
        .from("verification_requests")
        .select("id")
        .eq("profile_id", profileId)
        .limit(1);

      if (requestFetchError) {
        setError(requestFetchError.message);
        setSavingId(null);
        return;
      }

      if (existingRequest && existingRequest.length > 0) {
        const { error: requestUpdateError } = await supabase
          .from("verification_requests")
          .update({ status: "pending", submitted_at: now, review_message: null })
          .eq("profile_id", profileId);

        if (requestUpdateError) {
          setError(requestUpdateError.message);
          setSavingId(null);
          return;
        }
      } else {
        const { error: requestInsertError } = await supabase
          .from("verification_requests")
          .insert({ profile_id: profileId, status: "pending", submitted_at: now });

        if (requestInsertError) {
          setError(requestInsertError.message);
          setSavingId(null);
          return;
        }
      }
    }

    setProfiles((prev) =>
      nextStatus === "approved"
        ? prev.map((p) => (p.id === profileId ? { ...p, status: nextStatus } : p))
        : prev.filter((p) => p.id !== profileId),
    );
    setSavingId(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FB] flex items-center justify-center">
        <p className="text-sm text-gray-600">Cargando panel...</p>
      </div>
    );
  }

  if (!isMaster) {
    return (
      <div className="min-h-screen bg-[#F5F6FB] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Acceso restringido</h1>
          <p className="text-gray-600">Solo el usuario administrador puede ver este panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FB] text-gray-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-gray-200 bg-white lg:w-72 lg:border-b-0 lg:border-r lg:min-h-screen lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-5 sm:py-5">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-widest text-violet-500/80 font-semibold">Bienvenido</p>
              <p className="mt-1 truncate text-xl font-semibold leading-none">{adminName}</p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-3 py-4 sm:px-4 lg:block lg:space-y-2 lg:px-4 lg:py-6">
            <button
              onClick={() => router.push("/admin")}
              className="flex min-w-max flex-none items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-gray-700 hover:bg-gray-100 lg:w-full"
            >
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </button>
            <button
              onClick={() => router.push("/admin/solicitudes")}
              className="flex min-w-max flex-none items-center justify-between gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-gray-700 hover:bg-gray-100 lg:w-full"
            >
              <span className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5" /> Solicitudes
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">
                {pendingCount}
              </span>
            </button>
            <button className="flex min-w-max flex-none items-center gap-3 whitespace-nowrap rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-indigo-600 px-4 py-3 text-left text-white shadow-lg shadow-violet-300/40 lg:w-full">
              <Users className="h-5 w-5" /> Perfiles
            </button>
          </nav>

          <div className="border-t border-gray-200 p-3 sm:p-4 lg:mt-auto">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" /> Cerrar Sesion
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          {error ? <p className="text-sm text-rose-600 mb-4">{error}</p> : null}

          <section className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-8 sm:py-6">
              <h2 className="text-xl font-bold sm:text-2xl">Perfiles</h2>
              <p className="text-gray-500 mt-1">
                Cambia el estado de veterinarios y clinicas veterinarias.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="bg-gray-50 text-gray-700 text-left">
                  <tr>
                    <th className="px-8 py-4 font-semibold">Nombre</th>
                    <th className="px-8 py-4 font-semibold">Correo</th>
                    <th className="px-8 py-4 font-semibold">Tipo</th>
                    <th className="px-8 py-4 font-semibold">Estado</th>
                    <th className="px-8 py-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                        No hay perfiles registrados.
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile) => {
                      const name = displayNames[profile.id] || "-";
                      const roleLabel = profile.role === "clinic" ? "Clinica" : "Veterinario";
                      const currentStatus = (profile.status as StatusOption) ?? "pending";

                      return (
                        <tr key={profile.id} className="border-t border-gray-100">
                          <td className="px-8 py-4 font-semibold">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl border border-violet-100 bg-violet-50/70 overflow-hidden flex items-center justify-center">
                                {profileImages[profile.id] ? (
                                  <ImageWithFallback
                                    src={profileImages[profile.id]}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs text-violet-600 font-semibold">
                                    {roleLabel === "Clinica" ? "CL" : "VT"}
                                  </span>
                                )}
                              </div>
                              <span>{name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-gray-600">{profile.email ?? "-"}</td>
                          <td className="px-8 py-4">
                            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700">
                              {roleLabel}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700">
                              {currentStatus}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <select
                                value={currentStatus}
                                onChange={(e) =>
                                  handleStatusChange(profile.id, e.target.value as StatusOption)
                                }
                                disabled={savingId === profile.id}
                                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700"
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              {savingId === profile.id ? (
                                <span className="text-xs text-gray-500">Guardando...</span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
