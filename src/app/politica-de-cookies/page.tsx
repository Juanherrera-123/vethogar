import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { legalDocuments } from "@/content/legal-documents";

export const metadata: Metadata = {
  title: "Politica de Cookies | Vethogar",
  description: "Politica de cookies y tecnologias similares en Vethogar.",
};

export default function PoliticaDeCookiesPage() {
  return <LegalDocumentPage document={legalDocuments.cookies} />;
}

