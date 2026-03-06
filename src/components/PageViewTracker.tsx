"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const sessionStorageKey = "vethogar_session_id";

const resolveSessionId = () => {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(sessionStorageKey);
  if (existing) return existing;
  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(sessionStorageKey, generated);
  return generated;
};

const parseProfileId = (pathname: string) => {
  if (!pathname.startsWith("/veterinario/")) return null;
  const parts = pathname.split("/");
  const candidate = parts[2] ?? "";
  return candidate || null;
};

const isTrackablePath = (pathname: string) => {
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/dashboard")) return false;
  if (pathname.startsWith("/login")) return false;
  if (pathname.startsWith("/reset-password")) return false;
  if (pathname.startsWith("/forgot-password")) return false;
  if (pathname.startsWith("/auth/")) return false;
  return true;
};

export function PageViewTracker() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const pathWithQuery = useMemo(() => {
    const query = searchParams?.toString() ?? "";
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isTrackablePath(pathname)) return;
    const sessionId = resolveSessionId();
    const profileId = parseProfileId(pathname);
    const payload = JSON.stringify({
      path: pathWithQuery,
      profileId,
      sessionId,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const body = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/page-view", body);
      return;
    }

    void fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathWithQuery, pathname]);

  return null;
}
