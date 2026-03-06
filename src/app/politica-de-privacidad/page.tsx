import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { legalDocuments } from "@/content/legal-documents";

export const metadata: Metadata = {
  title: "Politica de Privacidad | Vethogar",
  description: "Politica de tratamiento de datos personales de Vethogar.",
};

export default function PoliticaDePrivacidadPage() {
  return <LegalDocumentPage document={legalDocuments.privacy} />;
}

