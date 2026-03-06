"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { RequestReviewModal } from "@/components/admin/RequestReviewModal";

interface VerificationRequest {
  id: string;
  profile_id: string;
  status: string;
  submitted_at: string;
  source?: "request" | "profile";
}

interface ProfileInfo {
  id: string;
  email: string;
  role: string;
  status?: string | null;
}

type DecisionStatus = "approved" | "rejected" | "changes_requested";

export default function AdminSolicitudesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileInfo>>({});
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Admin User");
  const [totalVets, setTotalVets] = useState(0);
  const [totalClinics, setTotalClinics] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviewParamHandled, setReviewParamHandled] = useState(false);

  const openRequests = useMemo(
    () => requests.filter((request) => request.status !== "approved"),
    [requests],
  );

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    if (!isMaster || reviewParamHandled) return;
    const reviewId = new URLSearchParams(window.location.search).get("review");
    if (!reviewId) return;
    setError(null);
    setSuccessMessage(null);
    setSelectedProfileId(reviewId);
    setReviewModalOpen(true);
    setReviewParamHandled(true);
    window.history.replaceState({}, "", "/admin/solicitudes");
  }, [isMaster, reviewParamHandled]);

  const fetchRequests = useCallback(async () => {
    const { data: requestData, error: requestError } = await supabase
      .from("verification_requests")
      .select("id, profile_id, status, submitted_at")
      .order("submitted_at", { ascending: false });

    if (requestError) {
      setError(requestError.message);
      return;
    }

    const requestProfileIds = (requestData ?? []).map((item) => item.profile_id);

    const { data: requestProfiles, error: profileListError } = await supabase
      .from("profiles")
      .select("id, email, role, status, created_at, updated_at")
      .in("id", requestProfileIds);

    if (profileListError) {
      setError(profileListError.message);
      return;
    }

    const { data: openProfiles, error: openProfilesError } = await supabase
      .from("profiles")
      .select("id, email, role, status, created_at, updated_at")
      .in("role", ["vet", "clinic"])
      .or("status.neq.approved,status.is.null");

    if (openProfilesError) {
      setError(openProfilesError.message);
      return;
    }

    const requestList = (requestData ?? []).map((item) => ({
      ...item,
      source: "request" as const,
    }));

    const requestIdSet = new Set(requestList.map((item) => item.profile_id));
    const fallbackRequests = (openProfiles ?? [])
      .filter((profile) => !requestIdSet.has(profile.id))
      .map((profile) => ({
        id: `profile:${profile.id}`,
        profile_id: profile.id,
        status: profile.status ?? "pending",
        submitted_at: profile.updated_at ?? profile.created_at ?? new Date().toISOString(),
        source: "profile" as const,
      }));

    const combinedProfiles = [...(requestProfiles ?? []), ...(openProfiles ?? [])];
    const dedupedProfiles = Object.values(
      combinedProfiles.reduce<Record<string, typeof combinedProfiles[number]>>((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {}),
    );

    const profileMap: Record<string, ProfileInfo> = {};
    dedupedProfiles.forEach((profile) => {
      profileMap[profile.id] = profile as ProfileInfo;
    });
    setProfiles(profileMap);

    const vetIds = dedupedProfiles.filter((p) => p.role === "vet").map((p) => p.id);
    const clinicIds = dedupedProfiles.filter((p) => p.role === "clinic").map((p) => p.id);

    const nextNames: Record<string, string> = {};
    const nextImages: Record<string, string> = {};

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
          nextImages[v.id] = imageUrl;
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
          nextImages[c.id] = c.logo_url;
        }
      });
    }

    setDisplayNames(nextNames);
    setProfileImages(nextImages);
    const mergedRequests = [...requestList, ...fallbackRequests].sort((a, b) => {
      const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
      const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
      return bTime - aTime;
    });
    setRequests(mergedRequests);
  }, []);

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

      const [vetsCountRes, clinicsCountRes, usersCountRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "vet"),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "clinic"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      setTotalVets(vetsCountRes.count ?? 0);
      setTotalClinics(clinicsCountRes.count ?? 0);
      setTotalUsers(usersCountRes.count ?? 0);

      await fetchRequests();
      setLoading(false);
    };

    init();
  }, [fetchRequests, router]);

  const handleDecision = async (request: VerificationRequest, decision: "approved" | "rejected") => {
    setError(null);
    setSuccessMessage(null);
    setActionLoadingId(request.id);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      router.push("/login");
      setActionLoadingId(null);
      return;
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        status: decision,
        is_public: decision === "approved",
        approved_at: decision === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", request.profile_id);

    if (profileUpdateError) {
      setError(profileUpdateError.message);
      setActionLoadingId(null);
      return;
    }

    if (request.source === "profile" || request.id.startsWith("profile:")) {
      const { data: latestRequest } = await supabase
        .from("verification_requests")
        .select("id")
        .eq("profile_id", request.profile_id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestRequest?.id) {
        const { error: requestUpdateError } = await supabase
          .from("verification_requests")
          .update({ status: decision, reviewed_by: user.id, review_message: null })
          .eq("id", latestRequest.id);

        if (requestUpdateError) {
          setError(requestUpdateError.message);
          setActionLoadingId(null);
          return;
        }
      } else {
        const { error: requestInsertError } = await supabase.from("verification_requests").insert({
          profile_id: request.profile_id,
          status: decision,
          submitted_at: new Date().toISOString(),
          reviewed_by: user.id,
          review_message: null,
        });

        if (requestInsertError) {
          setError(requestInsertError.message);
          setActionLoadingId(null);
          return;
        }
      }
    } else {
      const { error: requestUpdateError } = await supabase
        .from("verification_requests")
        .update({ status: decision, reviewed_by: user.id, review_message: null })
        .eq("id", request.id);

      if (requestUpdateError) {
        setError(requestUpdateError.message);
        setActionLoadingId(null);
        return;
      }
    }

    await fetchRequests();
    setSuccessMessage(
      decision === "approved" ? "Perfil aprobado exitosamente." : "Perfil rechazado exitosamente.",
    );
    setActionLoadingId(null);
  };

  const handleOpenReview = (profileId: string) => {
    setError(null);
    setSuccessMessage(null);
    setSelectedProfileId(profileId);
    setReviewModalOpen(true);
  };

  const handleReviewCompleted = async (decision: DecisionStatus) => {
    await fetchRequests();
    if (decision === "approved") {
      setSuccessMessage("Perfil aprobado exitosamente.");
      return;
    }
    if (decision === "rejected") {
      setSuccessMessage("Perfil rechazado exitosamente.");
      return;
    }
    setSuccessMessage("Cambios enviados con éxito.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
        <p className="text-sm text-gray-600">Cargando panel...</p>
      </div>
    );
  }

  if (!isMaster) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-4">
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
            <button className="flex min-w-max flex-none items-center justify-between gap-2 whitespace-nowrap rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-indigo-600 px-4 py-3 text-left text-white shadow-lg shadow-violet-300/40 lg:w-full">
              <span className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5" /> Solicitudes
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                {openRequests.length}
              </span>
            </button>
            <button
              onClick={() => router.push("/admin/perfiles")}
              className="flex min-w-max flex-none items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-gray-700 hover:bg-gray-100 lg:w-full"
            >
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

        <main className="flex-1">
          <section className="p-4 sm:p-6 lg:p-10">
            {error ? <p className="text-sm text-rose-600 mb-4">{error}</p> : null}
            {successMessage ? (
              <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              <article className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-3xl font-bold mt-2">{totalVets.toLocaleString("es-CO")}</p>
                <p className="text-sm text-gray-600 mt-1">Veterinarios</p>
              </article>
              <article className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-3xl font-bold mt-2 text-cyan-700">{totalClinics.toLocaleString("es-CO")}</p>
                <p className="text-sm text-gray-600 mt-1">Clinicas veterinarias</p>
              </article>
              <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-3xl font-bold mt-2 text-orange-600">{openRequests.length}</p>
                <p className="text-sm text-gray-600 mt-1">Solicitudes por revisar</p>
              </article>
              <article className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-7 md:col-span-2 lg:col-span-1">
                <p className="text-3xl font-bold mt-2">{totalUsers.toLocaleString("es-CO")}</p>
                <p className="text-sm text-gray-600 mt-1">Usuarios Registrados</p>
              </article>
            </div>

            <section className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-8 sm:py-6">
                <h2 className="text-xl font-bold sm:text-2xl">Solicitudes de Registro</h2>
                <p className="text-gray-500 mt-1">
                  Revisa solicitudes pendientes, rechazadas o con cambios solicitados
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead className="bg-gray-50 text-gray-700 text-left">
                    <tr>
                      <th className="px-8 py-4 font-semibold">Fecha</th>
                      <th className="px-8 py-4 font-semibold">Nombre Profesional</th>
                      <th className="px-8 py-4 font-semibold">Tipo</th>
                      <th className="px-8 py-4 font-semibold">Documentos</th>
                      <th className="px-8 py-4 font-semibold">Estado</th>
                      <th className="px-8 py-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-10 text-center text-gray-500">
                          No hay solicitudes por revisar.
                        </td>
                      </tr>
                    ) : (
                      openRequests.map((request) => {
                        const profile = profiles[request.profile_id];
                        const role = profile?.role === "clinic" ? "Clinica" : "Veterinario";
                        const displayName =
                          displayNames[request.profile_id] ||
                          profile?.email ||
                          request.profile_id;
                        const statusLabel =
                          request.status === "pending"
                            ? "Pendiente"
                            : request.status === "rejected"
                            ? "Rechazada"
                            : request.status === "changes_requested"
                            ? "Cambios solicitados"
                            : request.status;
                        const statusClass =
                          request.status === "pending"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : request.status === "rejected"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : request.status === "changes_requested"
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 bg-gray-50 text-gray-600";

                        return (
                          <tr key={request.id} className="border-t border-gray-100">
                            <td className="px-8 py-4 text-gray-600">{formatDate(request.submitted_at)}</td>
                            <td className="px-8 py-4 font-semibold">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl border border-violet-100 bg-violet-50/70 overflow-hidden flex items-center justify-center">
                                  {profileImages[request.profile_id] ? (
                                    <ImageWithFallback
                                      src={profileImages[request.profile_id]}
                                      alt={displayName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-violet-600 font-semibold">
                                      {role === "Clinica" ? "CL" : "VT"}
                                    </span>
                                  )}
                                </div>
                                <span>{displayName}</span>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700">
                                {role}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <button
                                onClick={() => handleOpenReview(request.profile_id)}
                                className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold"
                              >
                                <FileText className="h-4 w-4" /> Ver
                              </button>
                            </td>
                            <td className="px-8 py-4">
                              <span className={`rounded-full border px-3 py-1 text-sm ${statusClass}`}>
                                {statusLabel}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => handleDecision(request, "approved")}
                                  disabled={actionLoadingId === request.id}
                                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                                >
                                  <CheckCircle2 className="h-4 w-4" /> Aprobar
                                </button>
                                <button
                                  onClick={() => handleDecision(request, "rejected")}
                                  disabled={actionLoadingId === request.id}
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                                >
                                  <XCircle className="h-4 w-4" /> Rechazar
                                </button>
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
          </section>
        </main>
      </div>

      <RequestReviewModal
        profileId={selectedProfileId}
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedProfileId(null);
        }}
        onCompleted={handleReviewCompleted}
      />
    </div>
  );
}
