import { Suspense } from "react";
import DirectorioClient from "@/app/directorio/DirectorioClient";

export default function DirectorioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <DirectorioClient />
    </Suspense>
  );
}
