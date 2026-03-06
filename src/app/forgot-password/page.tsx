"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email) {
      setError("Ingresa tu correo para continuar.");
      return;
    }

    setSending(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setSending(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setInfo(`Revisa tu email ${email}, te enviamos una solicitud para restablecer tu contraseña.`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pb-12 pt-24 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-4 w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-2xl backdrop-blur-xl sm:rounded-[3rem] sm:p-10">
          <div className="mb-7 text-center sm:mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">¿Olvidaste tu contraseña?</h1>
            <p className="text-gray-600">Introduce tu email para restablecer tu contraseña</p>
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

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {info ? <p className="text-sm text-emerald-600">{info}</p> : null}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sending}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
              {sending ? "Enviando enlace..." : "Enviar enlace de restablecimiento"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
