"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (city: string, specialty: string) => void;
  className?: string;
  showLabel?: boolean;
}

export function SearchBar({ onSearch, className = '', showLabel = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');

  const cities = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Santa Marta',
    'Cúcuta',
    'Ibagué',
  ];

  const specialties = [
    'Medicina General',
    'Cirugía',
    'Dermatología',
    'Oftalmología',
    'Cardiología',
    'Odontología',
    'Nutrición',
    'Etología',
    'Traumatología',
    'Oncología',
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(city, specialty);
    }
    console.log('Searching for:', { city, specialty });
  };

  return (
    <div className={className}>
      {showLabel && (
        <p className="text-center text-gray-700 mb-4 font-medium text-lg">
          Comienza tu búsqueda aquí
        </p>
      )}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 md:p-10 border border-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* City Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-5 py-4 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all text-gray-700 bg-white/50 backdrop-blur-sm"
            >
              <option value="">Selecciona una ciudad</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Especialidad
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-5 py-4 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all text-gray-700 bg-white/50 backdrop-blur-sm"
            >
              <option value="">Selecciona una especialidad</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] hover:from-[#6D28D9] hover:to-[#3B0F87] text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-[1.02]"
        >
          <Search className="w-6 h-6" />
          <span className="text-lg">Buscar</span>
        </button>
      </div>
    </div>
  );
}
