import { Link, useLocation } from "react-router-dom"
import {
  Gem, LineChart, ScanSearch, Notebook, Menu, X
} from "lucide-react"
import { useState } from "react"

const links = [
  { to: "/admin", label: "Dashboard", icon: LineChart },
  { to: "/admin/cv", label: "Analizar", icon: ScanSearch },
  { to: "/admin/cv/historial", label: "Historial", icon: Notebook },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-rose-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/30 via-rose-50 to-rose-50 pointer-events-none" />

      <div className="relative">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-rose-200/60 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-rose-100"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-sm shrink-0">
                  <Gem className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm leading-tight">Municipalidad</p>
                  <p className="text-[10px] text-stone-400 leading-tight">Distrital de Yau</p>
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-violet-100 to-fuchsia-50 text-violet-700 shadow-sm border border-violet-200/60"
                        : "text-stone-500 hover:text-stone-700 hover:bg-rose-100/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {mobileOpen && (
            <nav className="lg:hidden border-t border-rose-200/60 px-4 py-2 space-y-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-violet-100 to-fuchsia-50 text-violet-700 shadow-sm border border-violet-200/60"
                        : "text-stone-500 hover:text-stone-700 hover:bg-rose-100/60"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          )}
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
