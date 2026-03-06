"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAuthErrorMessage = (authError: { message?: string | null }) => {
    const message = authError?.message?.toLowerCase() ?? "";
    if (message.includes("invalid login") || message.includes("invalid_credentials")) {
      return "Correo o contraseña incorrectos.";
    }
    if (message.includes("email not confirmed")) {
      return "Debes confirmar tu correo antes de iniciar sesión.";
    }
    if (message.includes("user not found")) {
      return "No existe una cuenta con ese correo.";
    }
    if (message.includes("too many requests")) {
      return "Demasiados intentos. Espera un momento e intenta de nuevo.";
    }
    return "No pudimos iniciar sesión. Verifica tus datos e inténtalo de nuevo.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (authError) {
      setError(getAuthErrorMessage(authError));
      return;
    }

    const accessToken = data.session?.access_token;
    if (!accessToken) {
      setError("No pudimos validar tu sesión. Intenta de nuevo.");
      return;
    }

    const roleResponse = await fetch("/api/auth-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: "{}",
    });

    if (!roleResponse.ok) {
      setError("No pudimos validar tu perfil. Intenta de nuevo.");
      return;
    }

    const rolePayload = await roleResponse.json();
    const role = rolePayload?.role as string | null;

    if (!role) {
      setError("Tu perfil no tiene un rol asignado. Contacta al administrador.");
      return;
    }

    if (role === "master" || role === "admin") {
      router.push("/admin");
      return;
    }

    if (role === "vet" || role === "clinic") {
      router.push("/soy-veterinario");
      return;
    }

    router.push("/directorio");
  };


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pb-12 pt-24 sm:pt-32">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-8 top-8 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl sm:right-20 sm:top-10 sm:h-96 sm:w-96"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-4 w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-2xl backdrop-blur-xl sm:rounded-[3rem] sm:p-10">
          <div className="mb-7 text-center sm:mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Iniciar Sesión</h1>
            <p className="text-gray-600">Accede con tu correo y contraseña</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 border-2 border-purple-100 rounded-2xl focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-purple-300" />
                Recordarme
              </label>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-60"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Ingresando..." : "Ingresar"}
            </motion.button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
