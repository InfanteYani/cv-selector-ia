import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Sparkles, LogOut, LayoutDashboard, Brain, History, UserCircle
} from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"

const links = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard },
  { to: "/admin/cv", label: "Analizar CV", icon: Brain },
  { to: "/admin/cv/historial", label: "CVs Escaneados", icon: History },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/15 via-zinc-950 to-zinc-950 pointer-events-none" />

      <aside className="relative w-64 border-r border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm flex flex-col">
        <div className="p-6 border-b border-zinc-800/60">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-zinc-100 leading-tight">Muni Yau</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Análisis de CVs</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">{user?.nombre}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{user?.rol}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700/50"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="relative flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
