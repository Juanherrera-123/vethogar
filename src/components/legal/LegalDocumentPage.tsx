import { LegalDocument } from "@/content/legal-documents";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <article className="rounded-3xl border border-purple-100 bg-white/85 p-6 shadow-xl backdrop-blur-sm md:p-8">
          <header className="mb-6 border-b border-purple-100 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{document.title}</h1>
            <p className="mt-2 text-sm text-gray-600">Ultima actualización: {document.lastUpdated}</p>
          </header>

          <p className="mb-6 text-sm leading-relaxed text-gray-700 md:text-base">{document.intro}</p>

          <div className="space-y-6">
            {document.sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="text-base font-semibold text-gray-900 md:text-lg">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-gray-700 md:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 md:text-base">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

