"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ClipboardList, FileText, MapPin, Shield, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ProfileType = "vet" | "clinic";

const cities = [
  "Bogota",
  "Medellin",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Santa Marta",
  "Cucuta",
  "Ibague",
];

const vetSpecialties = [
  "Medicina interna",
  "Cardiologia",
  "Dermatologia",
  "Neurologia",
  "Oncologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Nefrologia y urologia",
  "Infectologia",
  "Medicina felina",
  "Medicina del dolor",
  "Imagenologia",
  "Patologia clinica",
  "Cirugia",
  "Ortopedia",
  "Neurocirugia",
  "Anestesiologia",
  "Oftalmologia",
  "Odontologia",
  "Comportamiento",
  "Nutricion",
  "Fisioterapia",
  "Medicinas alternativas",
  "Fauna silvestre",
  "Neonatologia",
];

const clinicServices = [
  "Cirugia",
  "Endoscopia",
  "Ecografia",
  "Radiografia",
  "Consulta general",
  "Consulta especializada",
  "Petshop",
  "Medicinas alternativas",
  "Hospital 24 horas",
  "Guarderia",
  "Laboratorio",
  "Bano, peluqueria",
  "Otro (diga cual)",
  "Consulta animales exoticos",
  "Resonancia magnetica",
  "Tomografia",
];

const clinicRoles = ["Propietario", "Administrador", "Gerente", "Marketing"];

export default function SoyVeterinarioPage() {
  const router = useRouter();
  const [profileType, setProfileType] = useState<ProfileType>("vet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vetForm, setVetForm] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    city: "",
    address: "",
    about: "",
    professionalCardNumber: "",
    specialties: [] as string[],
    consultationCost: "",
    hours: "",
    experience: "",
    university: "",
    languages: "",
    awards: "",
    publications: "",
    socialLinks: "",
    otherSpecialties: "",
  });

  const [clinicForm, setClinicForm] = useState({
    clinicName: "",
    professionalsCount: "",
    city: "",
    address: "",
    firstName: "",
    lastName: "",
    sex: "",
    age: "",
    phone: "",
    role: "",
    email: "",
    emailConfirmation: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    authorizationAccepted: false,
    about: "",
    consultationCost: "",
    hours: "",
    services: [] as string[],
    otherService: "",
  });

  const toggleVetSpecialty = (value: string) => {
    setVetForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(value)
        ? prev.specialties.filter((item) => item !== value)
        : [...prev.specialties, value],
    }));
  };

  const toggleClinicService = (value: string) => {
    setClinicForm((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter((item) => item !== value)
        : [...prev.services, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (profileType === "vet") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: vetForm.email,
        password: vetForm.password,
      });

      if (signUpError || !data.user) {
        setError(signUpError?.message || "No se pudo crear la cuenta.");
        setLoading(false);
        return;
      }

      const userId = data.user.id;

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: "vet",
        email: vetForm.email,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      const { error: vetError } = await supabase.from("vet_profiles").insert({
        id: userId,
        first_name: vetForm.firstName,
        last_name: vetForm.lastName,
        sex: vetForm.sex,
        age: vetForm.age ? Number(vetForm.age) : null,
        phone: vetForm.phone,
        city: vetForm.city,
        address: vetForm.address,
        about: vetForm.about,
        professional_card_number: vetForm.professionalCardNumber,
        specialties: vetForm.specialties,
        consultation_cost: vetForm.consultationCost,
        hours: vetForm.hours,
        experience: vetForm.experience,
        university: vetForm.university,
        languages: vetForm.languages,
        awards: vetForm.awards,
        publications: vetForm.publications,
        social_links: vetForm.socialLinks,
      });

      if (vetError) {
        setError(vetError.message);
        setLoading(false);
        return;
      }

      const { error: verificationError } = await supabase
        .from("verification_requests")
        .insert({ profile_id: userId });

      if (verificationError) {
        setError(verificationError.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: clinicForm.email,
        password: clinicForm.password,
      });

      if (signUpError || !data.user) {
        setError(signUpError?.message || "No se pudo crear la cuenta.");
        setLoading(false);
        return;
      }

      const userId = data.user.id;

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: "clinic",
        email: clinicForm.email,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      const { error: clinicError } = await supabase.from("clinic_profiles").insert({
        id: userId,
        clinic_name: clinicForm.clinicName,
        professionals_count: clinicForm.professionalsCount
          ? Number(clinicForm.professionalsCount)
          : null,
        city: clinicForm.city,
        address: clinicForm.address,
        first_name: clinicForm.firstName,
        last_name: clinicForm.lastName,
        sex: clinicForm.sex,
        age: clinicForm.age ? Number(clinicForm.age) : null,
        phone: clinicForm.phone,
        role: clinicForm.role,
        about: clinicForm.about,
        consultation_cost: clinicForm.consultationCost,
        hours: clinicForm.hours,
        services: clinicForm.services,
        other_service: clinicForm.otherService,
      });

      if (clinicError) {
        setError(clinicError.message);
        setLoading(false);
        return;
      }

      const { error: verificationError } = await supabase
        .from("verification_requests")
        .insert({ profile_id: userId });

      if (verificationError) {
        setError(verificationError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/directorio");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pt-32 pb-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4"
            >
              — Registro profesional
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Crea tu perfil en <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">Vethogar</span>
            </h1>
            <p className="text-lg text-gray-600">
              Completa tu informacion para iniciar el proceso de verificacion.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <button
              type="button"
              onClick={() => setProfileType("vet")}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                profileType === "vet"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white shadow-lg"
                  : "bg-white/70 text-gray-700 border border-white/60"
              }`}
            >
              Veterinario
            </button>
            <button
              type="button"
              onClick={() => setProfileType("clinic")}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                profileType === "clinic"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white shadow-lg"
                  : "bg-white/70 text-gray-700 border border-white/60"
              }`}
            >
              Clinica Veterinaria
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/50"
          >
            {profileType === "vet" ? (
              <div className="space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Datos personales
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombres</label>
                      <input
                        value={vetForm.firstName}
                        onChange={(e) => setVetForm({ ...vetForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos</label>
                      <input
                        value={vetForm.lastName}
                        onChange={(e) => setVetForm({ ...vetForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo</label>
                      <input
                        value={vetForm.sex}
                        onChange={(e) => setVetForm({ ...vetForm, sex: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
                      <input
                        value={vetForm.age}
                        onChange={(e) => setVetForm({ ...vetForm, age: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono de contacto</label>
                      <input
                        value={vetForm.phone}
                        onChange={(e) => setVetForm({ ...vetForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                      <input
                        type="email"
                        value={vetForm.email}
                        onChange={(e) => setVetForm({ ...vetForm, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contrasena</label>
                      <input
                        type="password"
                        value={vetForm.password}
                        onChange={(e) => setVetForm({ ...vetForm, password: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmacion de contrasena</label>
                      <input
                        type="password"
                        value={vetForm.confirmPassword}
                        onChange={(e) => setVetForm({ ...vetForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    Ubicacion de servicios
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                      <select
                        value={vetForm.city}
                        onChange={(e) => setVetForm({ ...vetForm, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      >
                        <option value="">Selecciona</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Direccion (opcional)</label>
                      <input
                        value={vetForm.address}
                        onChange={(e) => setVetForm({ ...vetForm, address: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    Datos profesionales
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sobre mi</label>
                      <textarea
                        rows={4}
                        value={vetForm.about}
                        onChange={(e) => setVetForm({ ...vetForm, about: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Numero tarjeta profesional</label>
                      <input
                        value={vetForm.professionalCardNumber}
                        onChange={(e) => setVetForm({ ...vetForm, professionalCardNumber: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Costo de la consulta</label>
                      <input
                        value={vetForm.consultationCost}
                        onChange={(e) => setVetForm({ ...vetForm, consultationCost: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Horarios de atencion</label>
                      <input
                        value={vetForm.hours}
                        onChange={(e) => setVetForm({ ...vetForm, hours: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Especialidades</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {vetSpecialties.map((specialty) => (
                        <label
                          key={specialty}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
                            vetForm.specialties.includes(specialty)
                              ? "bg-purple-600 text-white"
                              : "bg-white/70 text-gray-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={vetForm.specialties.includes(specialty)}
                            onChange={() => toggleVetSpecialty(specialty)}
                            className="hidden"
                          />
                          {specialty}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Diplomados (texto libre)</label>
                      <input
                        value={vetForm.otherSpecialties}
                        onChange={(e) => setVetForm({ ...vetForm, otherSpecialties: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experiencia</label>
                      <input
                        value={vetForm.experience}
                        onChange={(e) => setVetForm({ ...vetForm, experience: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Universidad</label>
                      <input
                        value={vetForm.university}
                        onChange={(e) => setVetForm({ ...vetForm, university: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Idiomas</label>
                      <input
                        value={vetForm.languages}
                        onChange={(e) => setVetForm({ ...vetForm, languages: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Premios</label>
                      <input
                        value={vetForm.awards}
                        onChange={(e) => setVetForm({ ...vetForm, awards: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Publicaciones</label>
                      <input
                        value={vetForm.publications}
                        onChange={(e) => setVetForm({ ...vetForm, publications: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Redes sociales</label>
                      <input
                        value={vetForm.socialLinks}
                        onChange={(e) => setVetForm({ ...vetForm, socialLinks: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        placeholder="Instagram, LinkedIn, etc"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Documentos y fotos
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Foto tarjeta profesional",
                      "Foto titulo especialidad",
                      "Foto diplomado",
                      "Foto de perfil",
                      "Fotos profesionales",
                    ].map((label) => (
                      <label
                        key={label}
                        className="flex items-center gap-3 border-2 border-dashed border-purple-200 rounded-2xl px-4 py-5 bg-white/50 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                        <input type="file" className="hidden" />
                      </label>
                    ))}
                  </div>
                </section>

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={vetForm.termsAccepted}
                    onChange={(e) => setVetForm({ ...vetForm, termsAccepted: e.target.checked })}
                    className="h-4 w-4 mt-1 rounded border-purple-300"
                    required
                  />
                  Acepto la politica de privacidad, terminos y condiciones.
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    Datos de la clinica
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre clinica veterinaria</label>
                      <input
                        value={clinicForm.clinicName}
                        onChange={(e) => setClinicForm({ ...clinicForm, clinicName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Numero de profesionales</label>
                      <input
                        value={clinicForm.professionalsCount}
                        onChange={(e) => setClinicForm({ ...clinicForm, professionalsCount: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                      <select
                        value={clinicForm.city}
                        onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      >
                        <option value="">Selecciona</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Direccion</label>
                      <input
                        value={clinicForm.address}
                        onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Representante
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombres</label>
                      <input
                        value={clinicForm.firstName}
                        onChange={(e) => setClinicForm({ ...clinicForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos</label>
                      <input
                        value={clinicForm.lastName}
                        onChange={(e) => setClinicForm({ ...clinicForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo</label>
                      <input
                        value={clinicForm.sex}
                        onChange={(e) => setClinicForm({ ...clinicForm, sex: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
                      <input
                        value={clinicForm.age}
                        onChange={(e) => setClinicForm({ ...clinicForm, age: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono de contacto</label>
                      <input
                        value={clinicForm.phone}
                        onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                      <select
                        value={clinicForm.role}
                        onChange={(e) => setClinicForm({ ...clinicForm, role: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      >
                        <option value="">Selecciona</option>
                        {clinicRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                      <input
                        type="email"
                        value={clinicForm.email}
                        onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Verificacion correo</label>
                      <input
                        type="email"
                        value={clinicForm.emailConfirmation}
                        onChange={(e) => setClinicForm({ ...clinicForm, emailConfirmation: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contrasena</label>
                      <input
                        type="password"
                        value={clinicForm.password}
                        onChange={(e) => setClinicForm({ ...clinicForm, password: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmacion de contrasena</label>
                      <input
                        type="password"
                        value={clinicForm.confirmPassword}
                        onChange={(e) => setClinicForm({ ...clinicForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                        required
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    Servicios y operacion
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sobre nosotros</label>
                      <textarea
                        rows={4}
                        value={clinicForm.about}
                        onChange={(e) => setClinicForm({ ...clinicForm, about: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Costo consulta</label>
                      <input
                        value={clinicForm.consultationCost}
                        onChange={(e) => setClinicForm({ ...clinicForm, consultationCost: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Horarios de atencion</label>
                      <input
                        value={clinicForm.hours}
                        onChange={(e) => setClinicForm({ ...clinicForm, hours: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Servicios</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {clinicServices.map((service) => (
                        <label
                          key={service}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
                            clinicForm.services.includes(service)
                              ? "bg-purple-600 text-white"
                              : "bg-white/70 text-gray-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={clinicForm.services.includes(service)}
                            onChange={() => toggleClinicService(service)}
                            className="hidden"
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Documentos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Foto del RUT",
                      "Foto sec. de Salud",
                    ].map((label) => (
                      <label
                        key={label}
                        className="flex items-center gap-3 border-2 border-dashed border-purple-200 rounded-2xl px-4 py-5 bg-white/50 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                        <input type="file" className="hidden" />
                      </label>
                    ))}
                  </div>
                </section>

                <div className="space-y-3 text-sm text-gray-600">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={clinicForm.termsAccepted}
                      onChange={(e) => setClinicForm({ ...clinicForm, termsAccepted: e.target.checked })}
                      className="h-4 w-4 mt-1 rounded border-purple-300"
                      required
                    />
                    Acepto politica de privacidad, terminos y condiciones.
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={clinicForm.authorizationAccepted}
                      onChange={(e) => setClinicForm({ ...clinicForm, authorizationAccepted: e.target.checked })}
                      className="h-4 w-4 mt-1 rounded border-purple-300"
                      required
                    />
                    Tengo la autorizacion de crear una cuenta.
                  </label>
                </div>
              </div>
            )}

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <div className="mt-10 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-60"
              >
                <Shield className="w-5 h-5" />
                {loading ? "Enviando..." : "Enviar solicitud"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
