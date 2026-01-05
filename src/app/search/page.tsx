import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Container from "../../components/layout/Container";

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="py-16">
        <Container>
          <h1 className="text-3xl font-semibold text-slate-900">Buscar</h1>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
