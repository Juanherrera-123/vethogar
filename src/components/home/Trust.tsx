import Container from "../layout/Container";

const features = [
  {
    title: "Profesionales verificados",
    description: "Perfiles revisados para ayudarte a elegir con tranquilidad.",
    icon: "✅",
  },
  {
    title: "Contacto directo",
    description: "Comunícate rápidamente con veterinarios y clínicas.",
    icon: "💬",
  },
  {
    title: "Búsqueda simple y rápida",
    description: "Encuentra opciones por especialidad y ciudad en segundos.",
    icon: "⚡",
  },
];

const Trust = () => {
  return (
    <section className="bg-white py-14">
      <Container>
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            VetHogar es confianza
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl">
                  <span aria-hidden="true">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Trust;
