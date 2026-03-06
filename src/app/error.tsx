"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for debugging in dev
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-800">Se produjo un error</h1>
        <p className="text-sm text-red-700 mt-2">
          Abre la consola del navegador para ver el detalle. Si quieres, copia y pegalo aqui.
        </p>
        <pre className="mt-4 text-xs text-red-800 whitespace-pre-wrap">{error.message}</pre>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
