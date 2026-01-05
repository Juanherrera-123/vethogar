import Categories from "../components/home/Categories";
import FeaturedPros from "../components/home/FeaturedPros";
import FinalCTA from "../components/home/FinalCTA";
import HeroSearch from "../components/home/HeroSearch";
import Trust from "../components/home/Trust";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <HeroSearch />
        <Categories />
        <FeaturedPros />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
