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
      <div className="rounded-3xl border border-white/40 bg-white/80 p-5 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl sm:p-7 md:p-10">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:gap-5 md:mb-6 md:grid-cols-2 md:gap-6">
          {/* City Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/50 px-4 py-3.5 text-gray-700 backdrop-blur-sm transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 sm:px-5 sm:py-4"
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
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/50 px-4 py-3.5 text-gray-700 backdrop-blur-sm transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 sm:px-5 sm:py-4"
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] px-6 py-4 font-semibold text-white shadow-xl shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-[#6D28D9] hover:to-[#3B0F87] hover:shadow-2xl hover:shadow-purple-500/40 sm:gap-3 sm:px-8 sm:py-5"
        >
          <Search className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-base sm:text-lg">Buscar</span>
        </button>
      </div>
    </div>
  );
}
