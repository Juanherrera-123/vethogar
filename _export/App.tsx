"use client";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AcercaDe } from './pages/AcercaDe';
import { Directorio } from './pages/Directorio';
import { SoyVeterinario } from './pages/SoyVeterinario';
import { PerfilVeterinario } from './pages/PerfilVeterinario';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acerca-de" element={<AcercaDe />} />
            <Route path="/directorio" element={<Directorio />} />
            <Route path="/veterinario/:id" element={<PerfilVeterinario />} />
            <Route path="/soy-veterinario" element={<SoyVeterinario />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}