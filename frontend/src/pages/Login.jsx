import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Loader2, User, Lock, AlertCircle, IdCard } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"
import { api } from "../lib/api.js"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.login(dni, password)
      login(data.user)
      navigate(data.user.rol === "admin" ? "/admin" : "/ciudadano")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loginRapido = (d, p) => {
    setDni(d)
    setPassword(p)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/30 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">Municipalidad de Yau</h1>
          <p className="text-zinc-500 mt-2 text-sm">Sistema de Gestión de Trámites</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-zinc-100 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wider">DNI</label>
              <div className="relative mt-1">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500 focus:bg-zinc-800"
                  placeholder="12345678"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wider">Contraseña</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-3 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500 focus:bg-zinc-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-3 text-center">Accesos rápidos (demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginRapido("12345678", "admin123")}
                className="text-xs px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => loginRapido("11111111", "ciudadano123")}
                className="text-xs px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 transition-colors"
              >
                Ciudadano
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
