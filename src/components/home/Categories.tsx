import Container from "../layout/Container";
import { categories } from "../../data/mock";

const Categories = () => {
  return (
    <section id="especialidades" className="bg-white py-14">
      <Container>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              ¿Qué estás buscando hoy?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-lg">
                  <span aria-hidden="true">{category.icon}</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{category.label}</p>
                  <p className="text-sm text-slate-500">Opciones cercanas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Categories;
