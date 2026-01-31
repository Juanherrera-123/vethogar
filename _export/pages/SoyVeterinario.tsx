import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, Upload, CheckCircle, User, Building2, MapPin, FileText, Shield } from 'lucide-react';

type Step = 'login' | 'profile';

export function SoyVeterinario() {
  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    profileType: '',
    fullName: '',
    identification: '',
    phone: '',
    professionalCard: '',
    specialties: [] as string[],
    about: '',
    city: '',
    address: '',
    services: [] as string[],
    termsAccepted: false,
  });

  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta'];
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
  const services = ['Servicio a Domicilio', 'Urgencias 24h', 'Rayos X', 'Laboratorio', 'Guardería', 'Peluquería'];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending magic link to:', email);
    // Simulate login - in real app would send magic link
    setStep('profile');
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting profile:', formData);
    alert('¡Solicitud enviada! Te contactaremos pronto para verificar tu información.');
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pt-32 pb-12 flex items-center justify-center overflow-hidden relative">
        {/* Animated Background Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-4 relative z-10"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso Profesionales</h1>
              <p className="text-gray-600">Ingresa tu correo para comenzar</p>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40"
              >
                <Send className="w-5 h-5" />
                Enviar link de acceso
              </motion.button>
            </form>

            <p className="text-sm text-gray-600 text-center mt-6">
              Recibirás un enlace mágico en tu correo para acceder de forma segura
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pt-32 pb-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider mb-4"
            >
              — Únete a Vethogar
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Crea tu{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                Perfil Profesional
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Completa la información para que los dueños de mascotas puedan encontrarte
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/50">
            {/* Section A: Datos Básicos */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                Datos Básicos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Perfil
                  </label>
                  <select
                    value={formData.profileType}
                    onChange={(e) => setFormData({ ...formData, profileType: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Selecciona</option>
                    <option value="specialist">Veterinario Especialista</option>
                    <option value="clinic">Clínica Veterinaria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo / Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Identificación (CC/NIT)
                  </label>
                  <input
                    type="text"
                    value={formData.identification}
                    onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+57 300 123 4567"
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Información Profesional */}
            <div className="mb-10 pb-10 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                Información Profesional
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tarjeta Profesional
                </label>
                <input
                  type="text"
                  value={formData.professionalCard}
                  onChange={(e) => setFormData({ ...formData, professionalCard: e.target.value })}
                  required
                  placeholder="Número de tarjeta profesional"
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Especialidades (selecciona todas las que apliquen)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialties.map(specialty => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all font-medium ${
                        formData.specialties.includes(specialty)
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] border-[#7C3AED] text-white shadow-lg'
                          : 'bg-white/50 border-purple-100 text-gray-700 hover:border-[#7C3AED]'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sobre mí / Descripción
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  required
                  rows={4}
                  placeholder="Cuéntanos sobre tu experiencia y enfoque profesional..."
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all resize-none bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Section C: Ubicación y Servicios */}
            <div className="mb-10 pb-10 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Ubicación y Servicios
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Calle 123 #45-67"
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Servicios Ofrecidos
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map(service => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer bg-white/50 backdrop-blur-sm rounded-xl p-3 border-2 border-purple-100 hover:border-[#7C3AED] transition-all">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-5 h-5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      />
                      <span className="text-gray-700 font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section D: Documentos */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Documentos de Verificación
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center hover:border-[#7C3AED] hover:bg-purple-50/50 transition-all cursor-pointer backdrop-blur-sm">
                  <Upload className="w-12 h-12 text-[#7C3AED] mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 mb-1">Foto Tarjeta Profesional</p>
                  <p className="text-sm text-gray-500">Haz clic para cargar</p>
                </div>

                <div className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center hover:border-[#7C3AED] hover:bg-purple-50/50 transition-all cursor-pointer backdrop-blur-sm">
                  <Upload className="w-12 h-12 text-[#7C3AED] mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 mb-1">RUT / Cámara de Comercio</p>
                  <p className="text-sm text-gray-500">Haz clic para cargar</p>
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer bg-purple-50/50 rounded-2xl p-4 border-2 border-purple-100">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  required
                  className="w-5 h-5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED] mt-1"
                />
                <span className="text-gray-700">
                  Acepto los{' '}
                  <a href="#" className="text-[#7C3AED] hover:underline font-semibold">
                    Términos y Condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-[#7C3AED] hover:underline font-semibold">
                    Política de Privacidad
                  </a>
                </span>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!formData.termsAccepted}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] hover:shadow-2xl hover:shadow-purple-500/40 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-purple-500/30 flex items-center justify-center gap-3 text-lg"
            >
              <CheckCircle className="w-6 h-6" />
              Enviar Solicitud
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}