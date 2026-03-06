import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { legalDocuments } from "@/content/legal-documents";

export const metadata: Metadata = {
  title: "Terminos y Condiciones | Vethogar",
  description: "Condiciones de uso de la plataforma Vethogar.",
};

export default function TerminosYCondicionesPage() {
  return <LegalDocumentPage document={legalDocuments.terms} />;
}

