"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageViewTracker } from "@/components/PageViewTracker";

const panelPrefixes = ["/admin", "/dashboard", "/soy-veterinario"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPanel = panelPrefixes.some((prefix) => pathname?.startsWith(prefix));

  if (isPanel) {
    return (
      <>
        <PageViewTracker />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageViewTracker />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
