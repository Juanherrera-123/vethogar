"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, FileText, MessageCircle, X, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ProfileRecord {
  id: string;
  email: string;
  role: "vet" | "clinic" | "master" | "admin" | "client";
  status: "pending" | "approved" | "rejected" | "changes_requested";
}

interface VerificationRecord {
  id: string;
  status: string;
  review_message?: string | null;
}

interface VetProfile {
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  address?: string | null;
  home_service_areas?: string | null;
  phone?: string | null;
  about?: string | null;
  professional_card_number?: string | null;
  professional_card_file_url?: string | null;
  specialties?: string[] | null;
  specialty_documents?: { specialty: string; url: string }[] | null;
  consultation_cost?: string | null;
  hours?: string | null;
  experience?: string | null;
  university?: string | null;
  other_universities?: string[] | null;
  other_specialties?: string | null;
  languages?: string | null;
  awards?: string | null;
  publication_links?: unknown[] | null;
  social_links?: Record<string, string> | string | null;
  profile_photo_url?: string | null;
  professional_photos?: string[] | null;
}

interface ClinicProfile {
  logo_url?: string | null;
  clinic_name?: string | null;
  city?: string | null;
  address?: string | null;
  addresses?: string[] | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  sex?: string | null;
  role?: string | null;
  about?: string | null;
  consultation_cost?: string | null;
  hours?: string | null;
  services?: string[] | null;
  service_documents?: { service: string; url: string }[] | null;
  rut_file_url?: string | null;
  compliance_documents?: {
    mercantile_registry_url?: string;
    ica_registry_url?: string;
    professional_card_url?: string;
    undergraduate_diploma_url?: string;
  } | null;
}

type ScheduleValue = {
  is24h: boolean;
  slots: Record<string, string[]>;
};

type PublicationItem = {
  title: string;
  url: string;
};

type DecisionStatus = "approved" | "rejected" | "changes_requested";

interface RequestReviewModalProps {
  profileId: string | null;
  open: boolean;
  onClose: () => void;
  onCompleted: (decision: DecisionStatus) => void;
}

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const hourSlots = Array.from({ length: 13 }, (_, index) => {
  const hour = 7 + index;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const createEmptySchedule = (): ScheduleValue => ({
  is24h: false,
  slots: weekDays.reduce<Record<string, string[]>>((acc, day) => {
    acc[day] = [];
    return acc;
  }, {}),
});

const parseSchedule = (raw?: string | null): ScheduleValue => {
  if (!raw) return createEmptySchedule();
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.slots) {
      return {
        is24h: Boolean(parsed.is24h),
        slots: parsed.slots,
      };
    }
    return createEmptySchedule();
  } catch {
    return createEmptySchedule();
  }
};

const parsePublicationLinks = (value?: unknown[] | null): PublicationItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("{")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed && typeof parsed.url === "string") {
              return {
                title: typeof parsed.title === "string" ? parsed.title : "",
                url: parsed.url,
              };
            }
          } catch {
            return { title: "", url: trimmed };
          }
        }
        return { title: "", url: trimmed };
      }
      if (typeof item === "object") {
        const candidate = item as { title?: unknown; url?: unknown; name?: unknown; link?: unknown };
        const url = typeof candidate.url === "string" ? candidate.url : candidate.link;
        if (typeof url === "string" && url.trim()) {
          return {
            title: typeof candidate.title === "string" ? candidate.title : typeof candidate.name === "string" ? candidate.name : "",
            url,
          };
        }
      }
      return null;
    })
    .filter((item): item is PublicationItem => Boolean(item));
};

const formatValue = (value?: string | null) => (value && value.trim() ? value : "-");

const renderLink = (url?: string | null, label?: string) => {
  if (!url) return "No cargado";
  return (
    <a className="text-purple-600 hover:underline" href={url} target="_blank" rel="noreferrer">
      {label ?? "Ver archivo"}
    </a>
  );
};

const isImageUrl = (url?: string | null) => {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif"].some((ext) => clean.endsWith(ext));
};

const getFilenameFromUrl = (url?: string | null) => {
  if (!url) return "";
  const clean = url.split("?")[0];
  const parts = clean.split("/");
  return decodeURIComponent(parts[parts.length - 1] || "");
};

const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm text-gray-700">
      {formatValue(value)}
    </div>
  </div>
);

const FileField = ({ label, url }: { label: string; url?: string | null }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/80 via-white/70 to-purple-100/80 px-4 py-3 text-sm">
      {url && isImageUrl(url) ? (
        <a href={url} target="_blank" rel="noreferrer" className="block">
          <ImageWithFallback
            src={url}
            alt={label}
            className="h-40 w-full rounded-2xl object-cover"
          />
        </a>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/70 px-3 py-3">
          <FileText className="h-5 w-5 text-purple-600" />
          <span className="text-gray-700">{getFilenameFromUrl(url) || label}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{url ? "Archivo cargado" : "No cargado"}</span>
        {renderLink(url)}
      </div>
    </div>
  </div>
);

const ImagePreviewGrid = ({ urls }: { urls: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {urls.map((url, index) => {
      const filename = getFilenameFromUrl(url);
      const isImage = isImageUrl(url);
      return (
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl border border-purple-100 bg-white/70 p-2"
        >
          {isImage ? (
            <ImageWithFallback
              src={url}
              alt={`Foto ${index + 1}`}
              className="h-40 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-white/80 to-purple-100/70 px-4 py-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">{filename || `Archivo ${index + 1}`}</p>
                  <p className="text-xs text-gray-500">Ver archivo</p>
                </div>
              </div>
            </div>
          )}
        </a>
      );
    })}
  </div>
);

const ScheduleDisplay = ({ value }: { value: ScheduleValue }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
        {value.is24h ? "24 horas" : "Horario personalizado"}
      </span>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/80 via-white/80 to-fuchsia-50/80 shadow-sm">
      <table className="w-full text-[13px] text-gray-700">
        <thead className="bg-purple-100/70 text-purple-700">
          <tr>
            <th className="px-2 py-1.5 text-left font-semibold">Hora</th>
            {weekDays.map((day) => (
              <th key={day} className="px-1.5 py-1.5 text-center font-medium">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hourSlots.map((hour, hourIndex) => (
            <tr
              key={hour}
              className={`border-t border-purple-100 ${
                hourIndex % 2 === 0 ? "bg-white/70" : "bg-purple-50/60"
              }`}
            >
              <td className="px-2 py-1.5 font-semibold text-gray-700">{hour}</td>
              {weekDays.map((day) => {
                const checked = value.slots[day]?.includes(hour) ?? false;
                return (
                  <td key={`${day}-${hour}`} className="px-0.5 py-0.5 text-center">
                    <input
                      type="checkbox"
                      checked={value.is24h ? true : checked}
                      readOnly
                      disabled
                      className="h-5 w-5 rounded border-purple-300 accent-purple-600 opacity-70"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export function RequestReviewModal({
  profileId,
  open,
  onClose,
  onCompleted,
}: RequestReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [vetProfile, setVetProfile] = useState<VetProfile | null>(null);
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile | null>(null);
  const [requestRecord, setRequestRecord] = useState<VerificationRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!open || !profileId) return;
      setLoading(true);
      setError(null);
      setProfile(null);
      setVetProfile(null);
      setClinicProfile(null);
      setRequestRecord(null);
      setMessage("");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role, status")
        .eq("id", profileId)
        .maybeSingle();

      if (profileError || !profileData) {
        setError(profileError?.message || "Perfil no encontrado.");
        setLoading(false);
        return;
      }

      setProfile(profileData as ProfileRecord);

      const { data: requestData, error: requestError } = await supabase
        .from("verification_requests")
        .select("id, status, review_message")
        .eq("profile_id", profileId)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (requestError) {
        setError(requestError.message);
      }

      setRequestRecord(requestData ?? null);
      setMessage(requestData?.review_message ?? "");

      if (profileData.role === "vet") {
        const { data } = await supabase.from("vet_profiles").select("*").eq("id", profileId).maybeSingle();
        setVetProfile(data ?? null);
      }

      if (profileData.role === "clinic") {
        const { data } = await supabase.from("clinic_profiles").select("*").eq("id", profileId).maybeSingle();
        setClinicProfile(data ?? null);
      }

      setLoading(false);
    };

    loadData();
  }, [open, profileId]);

  const addresses = useMemo(() => {
    if (!clinicProfile) return [];
    if (Array.isArray(clinicProfile.addresses) && clinicProfile.addresses.length > 0) {
      return clinicProfile.addresses;
    }
    return clinicProfile.address ? [clinicProfile.address] : [];
  }, [clinicProfile]);

  const vetSchedule = useMemo(
    () => (vetProfile ? parseSchedule(vetProfile.hours) : createEmptySchedule()),
    [vetProfile],
  );

  const clinicSchedule = useMemo(
    () => (clinicProfile ? parseSchedule(clinicProfile.hours) : createEmptySchedule()),
    [clinicProfile],
  );

  const socialLinks = useMemo(() => {
    if (!vetProfile?.social_links) {
      return { instagram: "", facebook: "", twitter: "", linkedin: "" };
    }
    if (typeof vetProfile.social_links === "object") {
      return {
        instagram: vetProfile.social_links.instagram ?? "",
        facebook: vetProfile.social_links.facebook ?? "",
        twitter: vetProfile.social_links.twitter ?? "",
        linkedin: vetProfile.social_links.linkedin ?? "",
      };
    }
    try {
      const parsed = JSON.parse(vetProfile.social_links);
      return {
        instagram: parsed.instagram ?? "",
        facebook: parsed.facebook ?? "",
        twitter: parsed.twitter ?? "",
        linkedin: parsed.linkedin ?? "",
      };
    } catch {
      return { instagram: "", facebook: "", twitter: "", linkedin: "" };
    }
  }, [vetProfile?.social_links]);

  const publicationLinks = useMemo(
    () => parsePublicationLinks(vetProfile?.publication_links),
    [vetProfile?.publication_links],
  );

  const handleDecision = async (decision: DecisionStatus) => {
    if (!profile) return;

    if (decision === "changes_requested" && !message.trim()) {
      setError("Debes escribir un comentario para solicitar cambios.");
      return;
    }

    setActionLoading(true);
    setError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setError("Tu sesión expiró. Inicia sesión de nuevo.");
      setActionLoading(false);
      return;
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        status: decision,
        is_public: decision === "approved",
        approved_at: decision === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", profile.id);

    if (profileUpdateError) {
      setError(profileUpdateError.message);
      setActionLoading(false);
      return;
    }

    let targetRequestId = requestRecord?.id ?? null;

    if (!targetRequestId) {
      const { data: latestRequest } = await supabase
        .from("verification_requests")
        .select("id")
        .eq("profile_id", profile.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      targetRequestId = latestRequest?.id ?? null;
    }

    if (targetRequestId) {
      const { error: requestUpdateError } = await supabase
        .from("verification_requests")
        .update({
          status: decision,
          reviewed_by: user.id,
          review_message: decision === "changes_requested" ? message : null,
        })
        .eq("id", targetRequestId);

      if (requestUpdateError) {
        setError(requestUpdateError.message);
        setActionLoading(false);
        return;
      }
    } else {
      const { error: requestInsertError } = await supabase.from("verification_requests").insert({
        profile_id: profile.id,
        status: decision,
        submitted_at: new Date().toISOString(),
        reviewed_by: user.id,
        review_message: decision === "changes_requested" ? message : null,
      });

      if (requestInsertError) {
        setError(requestInsertError.message);
        setActionLoading(false);
        return;
      }
    }

    if (decision === "changes_requested") {
      const notifyResponse = await fetch("/api/notify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, message }),
      });
      if (!notifyResponse.ok) {
        const body = await notifyResponse.text();
        setError(
          `Se guardó el comentario, pero no pudimos enviar el correo de cambios: ${body}`,
        );
      }
    }

    setActionLoading(false);
    onCompleted(decision);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4">
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl border border-purple-100/70 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-purple-100 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-purple-600/70 font-semibold">
              {profile?.role === "vet" ? "Veterinario" : profile?.role === "clinic" ? "Clinica" : "Perfil"}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{profile?.email ?? "Revisión de perfil"}</h2>
            <p className="text-sm text-gray-600">
              Estado actual: <span className="font-semibold">{profile?.status ?? "-"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-200 bg-white text-purple-700 hover:bg-purple-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-6 py-6">
          {loading ? (
            <p className="text-sm text-gray-600">Cargando solicitud...</p>
          ) : (
            <>
              {error ? <p className="text-sm text-rose-600 mb-4">{error}</p> : null}

              {profile?.role === "vet" && vetProfile ? (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ubicación de servicios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField label="Ciudad de residencia" value={vetProfile.city} />
                      <InfoField label="Direccion consultorio" value={vetProfile.address} />
                      <InfoField
                        label="Zonas de atencion domiciliaria"
                        value={vetProfile.home_service_areas}
                      />
                      <InfoField label="Telefono" value={vetProfile.phone} />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Datos profesionales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Sobre mi</label>
                        <div className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm text-gray-700 min-h-[96px]">
                          {formatValue(vetProfile.about)}
                        </div>
                      </div>
                      <InfoField
                        label="Numero tarjeta profesional"
                        value={vetProfile.professional_card_number}
                      />
                      <FileField
                        label="Tarjeta profesional"
                        url={vetProfile.professional_card_file_url}
                      />
                      <InfoField label="Costo de la consulta" value={vetProfile.consultation_cost} />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Horarios de atencion
                        </label>
                        <ScheduleDisplay value={vetSchedule} />
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Enfasis medico
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(vetProfile.specialties ?? []).length > 0 ? (
                          (vetProfile.specialties ?? []).map((specialty) => (
                            <span
                              key={specialty}
                              className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
                            >
                              {specialty}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Certificados
                      </label>
                      {(vetProfile.specialty_documents ?? []).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vetProfile.specialty_documents?.map((doc) => (
                            <FileField
                              key={doc.specialty}
                              label={`Titulo ${doc.specialty}`}
                              url={doc.url}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField label="Años de experiencia" value={vetProfile.experience} />
                      <InfoField label="Universidad Pregrado" value={vetProfile.university} />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Otras universidades
                        </label>
                        <div className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm text-gray-700">
                          {(vetProfile.other_universities ?? []).length > 0
                            ? vetProfile.other_universities?.join(", ")
                            : "-"}
                        </div>
                      </div>
                      <InfoField label="Idiomas" value={vetProfile.languages} />
                      <InfoField label="Premios" value={vetProfile.awards} />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Links de publicaciones
                        </label>
                        <div className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm text-gray-700 space-y-2">
                          {publicationLinks.length > 0
                            ? publicationLinks.map((item, index) => (
                                <div key={`${item.url}-${index}`}>
                                  {renderLink(item.url, item.title || `Publicación ${index + 1}`)}
                                </div>
                              ))
                            : "-"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Redes sociales
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoField label="Instagram" value={socialLinks.instagram} />
                          <InfoField label="Facebook" value={socialLinks.facebook} />
                          <InfoField label="Twitter" value={socialLinks.twitter} />
                          <InfoField label="LinkedIn" value={socialLinks.linkedin} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Documentos y fotos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileField label="Foto de perfil" url={vetProfile.profile_photo_url} />
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fotos profesionales
                        </label>
                        <div className="space-y-2">
                          {(vetProfile.professional_photos ?? []).length > 0 ? (
                            <ImagePreviewGrid urls={vetProfile.professional_photos ?? []} />
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}

              {profile?.role === "clinic" && clinicProfile ? (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Datos de la clinica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Logo de la clinica
                        </label>
                        <div className="h-24 w-24 rounded-2xl border border-purple-100 bg-white/70 flex items-center justify-center overflow-hidden">
                          {clinicProfile.logo_url ? (
                            <ImageWithFallback
                              src={clinicProfile.logo_url}
                              alt="Logo clinica"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                      <InfoField label="Nombre clinica veterinaria" value={clinicProfile.clinic_name} />
                      <InfoField label="Ciudad de establecimiento" value={clinicProfile.city} />
                      <InfoField label="Telefono de contacto" value={clinicProfile.phone} />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Direcciones de sede
                        </label>
                        <div className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm text-gray-700">
                          {addresses.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {addresses.map((addr) => (
                                <li key={addr}>{addr}</li>
                              ))}
                            </ul>
                          ) : (
                            "-"
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Representante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField label="Nombres" value={clinicProfile.first_name} />
                      <InfoField label="Apellidos" value={clinicProfile.last_name} />
                      <InfoField label="Sexo" value={clinicProfile.sex} />
                      <InfoField label="Cargo" value={clinicProfile.role} />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Servicios y operacion</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sobre nosotros
                        </label>
                        <div className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm text-gray-700 min-h-[96px]">
                          {formatValue(clinicProfile.about)}
                        </div>
                      </div>
                      <InfoField label="Costo consulta" value={clinicProfile.consultation_cost} />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Horarios de atencion
                        </label>
                        <ScheduleDisplay value={clinicSchedule} />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Servicios</label>
                      <div className="flex flex-wrap gap-2">
                        {(clinicProfile.services ?? []).length > 0 ? (
                          clinicProfile.services?.map((service) => (
                            <span
                              key={service}
                              className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Documentos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileField label="Foto del RUT" url={clinicProfile.rut_file_url} />
                      <FileField
                        label="Registro mercantil"
                        url={clinicProfile.compliance_documents?.mercantile_registry_url}
                      />
                      <FileField
                        label="Registro ICA"
                        url={clinicProfile.compliance_documents?.ica_registry_url}
                      />
                      <FileField
                        label="Tarjeta profesional"
                        url={clinicProfile.compliance_documents?.professional_card_url}
                      />
                      <FileField
                        label="Diploma pregrado"
                        url={clinicProfile.compliance_documents?.undergraduate_diploma_url}
                      />
                      {(clinicProfile.service_documents ?? []).map((doc) => (
                        <FileField
                          key={doc.service}
                          label={`Licencia ${doc.service}`}
                          url={doc.url}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}

              {profile ? (
                <div className="mt-8 space-y-4 border-t border-purple-100 pt-6">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Comentario para solicitar cambios
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl border-2 border-purple-100 bg-white/70 px-4 py-3 text-sm"
                    placeholder="Escribe aqui lo que falta o debe corregirse..."
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecision("approved")}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-md hover:bg-emerald-600 disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" /> Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision("rejected")}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-4 py-2 text-sm font-semibold border border-rose-200 hover:bg-rose-200 disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" /> Rechazar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision("changes_requested")}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EC4899] to-[#4F46E5] text-white px-4 py-2 text-sm font-semibold shadow-md hover:opacity-90 disabled:opacity-60"
                    >
                      <FileText className="w-4 h-4" /> Solicitar cambios
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
