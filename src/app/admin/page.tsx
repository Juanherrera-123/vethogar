"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface VerificationRequest {
  id: string;
  profile_id: string;
  status: string;
  submitted_at: string;
}

interface DailyCount {
  label: string;
  count: number;
}

type ContactMetricsRange = "7d" | "30d" | "1m" | "1y";

interface ContactTopProfile {
  profile_id: string;
  name: string;
  role: string;
  whatsapp_clicks: number;
  call_clicks: number;
  total_clicks: number;
}

interface ContactMetricsResponse {
  summary: {
    whatsappClicks: number;
    callClicks: number;
    totalClicks: number;
  };
  topProfiles: ContactTopProfile[];
}

interface PageViewTopPath {
  path: string;
  views: number;
  unique_sessions: number;
}

interface PageViewTopProfile {
  profile_id: string;
  name: string;
  role: string;
  views: number;
  unique_sessions: number;
}

interface PageViewMetricsResponse {
  summary: {
    totalViews: number;
    uniqueSessions: number;
  };
  topPaths: PageViewTopPath[];
  topProfiles: PageViewTopProfile[];
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [newProfilesCount, setNewProfilesCount] = useState(0);
  const [adminName, setAdminName] = useState("Admin User");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [contactRange, setContactRange] = useState<ContactMetricsRange>("7d");
  const [contactMetricsLoading, setContactMetricsLoading] = useState(false);
  const [contactMetricsError, setContactMetricsError] = useState<string | null>(null);
  const [contactMetrics, setContactMetrics] = useState<ContactMetricsResponse>({
    summary: { whatsappClicks: 0, callClicks: 0, totalClicks: 0 },
    topProfiles: [],
  });
  const [pageViewMetricsLoading, setPageViewMetricsLoading] = useState(false);
  const [pageViewMetricsError, setPageViewMetricsError] = useState<string | null>(null);
  const [pageViewMetrics, setPageViewMetrics] = useState<PageViewMetricsResponse>({
    summary: { totalViews: 0, uniqueSessions: 0 },
    topPaths: [],
    topProfiles: [],
  });

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const loadContactMetrics = useCallback(
    async (token: string, range: ContactMetricsRange) => {
      setContactMetricsLoading(true);
      setContactMetricsError(null);
      try {
        const response = await fetch(`/api/admin/contact-metrics?range=${range}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "No se pudieron cargar las metricas de contacto.");
        }
        setContactMetrics({
          summary: {
            whatsappClicks: Number(payload?.summary?.whatsappClicks) || 0,
            callClicks: Number(payload?.summary?.callClicks) || 0,
            totalClicks: Number(payload?.summary?.totalClicks) || 0,
          },
          topProfiles: Array.isArray(payload?.topProfiles) ? payload.topProfiles : [],
        });
      } catch (err) {
        setContactMetricsError(
          err instanceof Error ? err.message : "No se pudieron cargar las metricas de contacto.",
        );
        setContactMetrics({
          summary: { whatsappClicks: 0, callClicks: 0, totalClicks: 0 },
          topProfiles: [],
        });
      } finally {
        setContactMetricsLoading(false);
      }
    },
    [],
  );

  const loadPageViewMetrics = useCallback(async (token: string, range: ContactMetricsRange) => {
    setPageViewMetricsLoading(true);
    setPageViewMetricsError(null);
    try {
      const response = await fetch(`/api/admin/page-view-metrics?range=${range}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudieron cargar las impresiones de pagina.");
      }
      setPageViewMetrics({
        summary: {
          totalViews: Number(payload?.summary?.totalViews) || 0,
          uniqueSessions: Number(payload?.summary?.uniqueSessions) || 0,
        },
        topPaths: Array.isArray(payload?.topPaths) ? payload.topPaths : [],
        topProfiles: Array.isArray(payload?.topProfiles) ? payload.topProfiles : [],
      });
    } catch (err) {
      setPageViewMetricsError(
        err instanceof Error ? err.message : "No se pudieron cargar las impresiones de pagina.",
      );
      setPageViewMetrics({
        summary: { totalViews: 0, uniqueSessions: 0 },
        topPaths: [],
        topProfiles: [],
      });
    } finally {
      setPageViewMetricsLoading(false);
    }
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

      setAdminToken(sessionData.session?.access_token ?? null);
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

      const { data: requestData, error: requestError } = await supabase
        .from("verification_requests")
        .select("id, profile_id, status, submitted_at")
        .order("submitted_at", { ascending: false });

      if (requestError) {
        setError(requestError.message);
        setLoading(false);
        return;
      }

      setRequests(requestData ?? []);

      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      const { data: profileRows, error: profileStatsError } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", start.toISOString());

      if (profileStatsError) {
        setDailyCounts([]);
        setNewProfilesCount(0);
        setLoading(false);
        return;
      }

      const countsByDay = new Map<string, number>();
      for (let i = 0; i <= 6; i += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const key = date.toISOString().slice(0, 10);
        countsByDay.set(key, 0);
      }

      (profileRows ?? []).forEach((row) => {
        if (!row.created_at) return;
        const key = new Date(row.created_at).toISOString().slice(0, 10);
        countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
      });

      const formatted = Array.from(countsByDay.entries()).map(([key, count]) => {
        const date = new Date(key);
        return {
          label: `${date.getDate()}/${date.getMonth() + 1}`,
          count,
        };
      });

      setDailyCounts(formatted);
      setNewProfilesCount(profileRows?.length ?? 0);
      setLoading(false);
    };

    init();
  }, [router]);

  useEffect(() => {
    if (!isMaster || !adminToken) return;
    void loadContactMetrics(adminToken, contactRange);
    void loadPageViewMetrics(adminToken, contactRange);
  }, [adminToken, contactRange, isMaster, loadContactMetrics, loadPageViewMetrics]);

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

  const maxCount = Math.max(1, ...dailyCounts.map((item) => item.count));
  const pendingVsNewStats = [
    { label: "Pendientes", count: pendingRequests.length, tone: "from-amber-500 to-orange-400" },
    { label: "Perfiles nuevos", count: newProfilesCount, tone: "from-indigo-500 to-violet-400" },
  ];
  const maxPendingVsNewCount = Math.max(1, ...pendingVsNewStats.map((item) => item.count));
  const contactRangeOptions: Array<{ key: ContactMetricsRange; label: string }> = [
    { key: "7d", label: "7 dias" },
    { key: "30d", label: "30 dias" },
    { key: "1m", label: "1 mes" },
    { key: "1y", label: "1 ano" },
  ];

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
              className="flex min-w-max flex-none items-center gap-3 whitespace-nowrap rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-indigo-600 px-4 py-3 text-left text-white shadow-lg shadow-violet-300/40 lg:w-full"
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
                {pendingRequests.length}
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

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          {error ? <p className="text-sm text-rose-600 mb-6">{error}</p> : null}

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            <article className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs uppercase tracking-widest text-violet-500/70 font-semibold">Solicitudes pendientes</p>
              <p className="text-3xl font-bold mt-2">{pendingRequests.length}</p>
              <p className="text-sm text-gray-500 mt-1">Revisar en solicitudes</p>
            </article>
            <article className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs uppercase tracking-widest text-indigo-500/70 font-semibold">Perfiles nuevos (7 dias)</p>
              <p className="text-3xl font-bold mt-2">{newProfilesCount}</p>
              <p className="text-sm text-gray-500 mt-1">Creaciones recientes</p>
            </article>
            <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7 md:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-widest text-emerald-500/70 font-semibold">Ultima actualizacion</p>
              <p className="text-lg font-semibold mt-2">{new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-500 mt-1">Datos del panel</p>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-500/70 font-semibold">Histograma</p>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">Perfiles creados nuevos</h2>
                </div>
                <button
                  onClick={() => router.push("/admin/solicitudes")}
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  Ver solicitudes
                </button>
              </div>
              <div className="overflow-x-auto">
                <div className="grid h-40 min-w-[430px] grid-cols-7 items-end gap-3">
                  {dailyCounts.map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2">
                      <div className="flex h-28 w-full items-end justify-center rounded-full bg-violet-100">
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-violet-500 to-fuchsia-400"
                          style={{ height: `${Math.max(12, (item.count / maxCount) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">{item.label}</div>
                      <div className="text-xs font-semibold text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-widest text-amber-600/70 font-semibold">
                  Comparativo
                </p>
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  Solicitudes pendientes vs perfiles nuevos
                </h2>
              </div>
              <div className="grid h-40 grid-cols-2 items-end gap-5">
                {pendingVsNewStats.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end justify-center rounded-2xl bg-gray-100">
                      <div
                        className={`w-full rounded-2xl bg-gradient-to-t ${item.tone}`}
                        style={{ height: `${Math.max(12, (item.count / maxPendingVsNewCount) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-600/70 font-semibold">
                  Contacto de perfiles
                </p>
                <h2 className="text-xl font-bold text-gray-900 mt-2">Clics en WhatsApp y Llamar</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {contactRangeOptions.map((option) => {
                  const isActive = contactRange === option.key;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setContactRange(option.key)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? "bg-cyan-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {contactMetricsError ? (
              <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {contactMetricsError}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                <p className="text-xs uppercase tracking-widest text-emerald-700/70 font-semibold">WhatsApp</p>
                <p className="text-3xl font-bold mt-2 text-emerald-700">
                  {contactMetricsLoading
                    ? "..."
                    : contactMetrics.summary.whatsappClicks.toLocaleString("es-CO")}
                </p>
              </article>
              <article className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                <p className="text-xs uppercase tracking-widest text-indigo-700/70 font-semibold">Llamadas</p>
                <p className="text-3xl font-bold mt-2 text-indigo-700">
                  {contactMetricsLoading
                    ? "..."
                    : contactMetrics.summary.callClicks.toLocaleString("es-CO")}
                </p>
              </article>
              <article className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
                <p className="text-xs uppercase tracking-widest text-cyan-700/70 font-semibold">Total de clics</p>
                <p className="text-3xl font-bold mt-2 text-cyan-700">
                  {contactMetricsLoading
                    ? "..."
                    : contactMetrics.summary.totalClicks.toLocaleString("es-CO")}
                </p>
              </article>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead className="bg-gray-50 text-left text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Perfil</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">WhatsApp</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Llamar</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMetricsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-sm text-gray-500">
                        Cargando metricas...
                      </td>
                    </tr>
                  ) : contactMetrics.topProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-sm text-gray-500">
                        No hay clics registrados en este rango.
                      </td>
                    </tr>
                  ) : (
                    contactMetrics.topProfiles.map((profile) => (
                      <tr key={profile.profile_id} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{profile.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {profile.role === "clinic" ? "Clinica" : profile.role === "vet" ? "Veterinario" : profile.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-emerald-700">{profile.whatsapp_clicks}</td>
                        <td className="px-4 py-3 text-sm text-indigo-700">{profile.call_clicks}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-cyan-700">{profile.total_clicks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-widest text-sky-600/70 font-semibold">
                Impresiones de pagina
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-2">Visitas e interes por perfil</h2>
            </div>

            {pageViewMetricsError ? (
              <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {pageViewMetricsError}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
                <p className="text-xs uppercase tracking-widest text-sky-700/70 font-semibold">Impresiones totales</p>
                <p className="text-3xl font-bold mt-2 text-sky-700">
                  {pageViewMetricsLoading
                    ? "..."
                    : pageViewMetrics.summary.totalViews.toLocaleString("es-CO")}
                </p>
              </article>
              <article className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/40 p-4">
                <p className="text-xs uppercase tracking-widest text-fuchsia-700/70 font-semibold">
                  Sesiones unicas
                </p>
                <p className="text-3xl font-bold mt-2 text-fuchsia-700">
                  {pageViewMetricsLoading
                    ? "..."
                    : pageViewMetrics.summary.uniqueSessions.toLocaleString("es-CO")}
                </p>
              </article>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-x-auto">
                <p className="mb-2 text-sm font-semibold text-gray-900">Top paginas</p>
                <table className="w-full min-w-[420px]">
                  <thead className="bg-gray-50 text-left text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Ruta</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Impresiones</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Sesiones unicas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViewMetricsLoading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-sm text-gray-500">
                          Cargando impresiones...
                        </td>
                      </tr>
                    ) : pageViewMetrics.topPaths.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-sm text-gray-500">
                          No hay impresiones registradas en este rango.
                        </td>
                      </tr>
                    ) : (
                      pageViewMetrics.topPaths.map((item) => (
                        <tr key={item.path} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.path}</td>
                          <td className="px-4 py-3 text-sm text-sky-700">{item.views}</td>
                          <td className="px-4 py-3 text-sm text-fuchsia-700">{item.unique_sessions}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto">
                <p className="mb-2 text-sm font-semibold text-gray-900">Top perfiles vistos</p>
                <table className="w-full min-w-[420px]">
                  <thead className="bg-gray-50 text-left text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Perfil</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Vistas</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-wider">Sesiones unicas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViewMetricsLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                          Cargando perfiles...
                        </td>
                      </tr>
                    ) : pageViewMetrics.topProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-sm text-gray-500">
                          No hay perfiles vistos en este rango.
                        </td>
                      </tr>
                    ) : (
                      pageViewMetrics.topProfiles.map((profile) => (
                        <tr key={profile.profile_id} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{profile.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {profile.role === "clinic" ? "Clinica" : profile.role === "vet" ? "Veterinario" : profile.role}
                          </td>
                          <td className="px-4 py-3 text-sm text-sky-700">{profile.views}</td>
                          <td className="px-4 py-3 text-sm text-fuchsia-700">{profile.unique_sessions}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
