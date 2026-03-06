"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMismatch =
    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setHasSession(!!data.session);
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 pb-12 pt-24 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-4 w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-2xl backdrop-blur-xl sm:rounded-[3rem] sm:p-10">
          <div className="mb-7 text-center sm:mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Restablecer contraseña</h1>
            <p className="text-gray-600">Crea una nueva contraseña segura</p>
          </div>

          {!hasSession ? (
            <div className="text-sm text-gray-600 bg-white/70 rounded-2xl p-4 border border-purple-100">
              Abre el enlace que recibiste en tu correo para continuar con el restablecimiento.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none transition-all bg-white/50 pr-12 ${
                      passwordsMismatch
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                        : "border-purple-100 focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100"
                    }`}
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none transition-all bg-white/50 pr-12 ${
                      passwordsMismatch
                        ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
                        : "border-purple-100 focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {passwordsMismatch ? (
                <p className="text-sm text-rose-600">Las contraseñas no coinciden.</p>
              ) : null}
              {success ? (
                <p className="text-sm text-emerald-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> {success}
                </p>
              ) : null}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || passwordsMismatch}
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-60"
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
