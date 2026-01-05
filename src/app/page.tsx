export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          Vethogar
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Bienvenido a tu nuevo espacio.
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Esta base ya está lista para que empieces a construir. Define tu
          identidad, añade secciones clave y dale vida a la experiencia.
        </p>
      </main>
    </div>
  );
}
