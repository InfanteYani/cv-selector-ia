import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Files, Rocket, Sparkles, ChartColumn, Clock, ExternalLink
} from "lucide-react"
import { api } from "../lib/api.js"
import DonutChart from "../components/DonutChart.jsx"

const CATEGORY_COLORS = {
  "Data Science": "#67e8f9",
  "Engineering": "#93c5fd",
  "Marketing": "#86efac",
  "HR": "#f9a8d4",
  "Finance": "#fde68a",
  "Advocate": "#fdba74",
  "Arts": "#d8b4fe",
  "Sales": "#fef08a",
  "Healthcare": "#fca5a5",
  "IT": "#7dd3fc",
}

const CATEGORY_BADGES = {
  "Data Science": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Engineering": "bg-blue-100 text-blue-700 border-blue-200",
  "Marketing": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "HR": "bg-pink-100 text-pink-700 border-pink-200",
  "Finance": "bg-amber-100 text-amber-700 border-amber-200",
  "Advocate": "bg-orange-100 text-orange-700 border-orange-200",
  "Arts": "bg-purple-100 text-purple-700 border-purple-200",
  "Sales": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Healthcare": "bg-red-100 text-red-700 border-red-200",
  "IT": "bg-sky-100 text-sky-700 border-sky-200",
}

function getBadge(cat) {
  return CATEGORY_BADGES[cat] || "bg-stone-100 text-stone-600 border-stone-200"
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recientes, setRecientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.statsCV(),
      api.historialCV(),
    ]).then(([s, h]) => {
      setStats(s)
      setRecientes(h.historial.slice(0, 6))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-300 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-sm text-stone-400">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  const chartData = stats?.por_categoria.map(c => ({
    key: c.categoria,
    metric1: Number((c.confianza_promedio || 0).toFixed(1)),
    metric2: c.cantidad * 10,
  })) || []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Panel</h1>
          <p className="text-stone-400 mt-1 text-sm">Resumen del análisis de currículos con IA</p>
        </div>
        <Link
          to="/admin/cv"
          className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
        >
          <Sparkles className="w-4 h-4" /> Nuevo análisis
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Files}
          label="CVs Analizados"
          value={stats?.total || 0}
          color="violet"
        />
        <StatCard
          icon={Rocket}
          label="Confianza Promedio"
          value={`${stats?.confianza_promedio || 0}%`}
          color="fuchsia"
        />
        <StatCard
          icon={ChartColumn}
          label="Categorías"
          value={stats?.por_categoria.length || 0}
          color="cyan"
        />
        <StatCard
          icon={Clock}
          label="Últimos 7 días"
          value={stats?.ultimos_7_dias.reduce((acc, d) => acc + d.cantidad, 0) || 0}
          color="emerald"
        />
      </div>

      {stats?.total > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/90 border border-rose-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ChartColumn className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-semibold text-stone-700">Distribución por Categoría</h3>
              </div>
              <DonutChart data={chartData} />
            </div>

            <div className="bg-white/90 border border-rose-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  Top Categorías
                </h3>
                <span className="text-xs text-stone-400">{stats.por_categoria.length} en total</span>
              </div>
              <div className="space-y-4">
                {stats.por_categoria.slice(0, 6).map(c => {
                  const max = Math.max(...stats.por_categoria.map(x => x.cantidad))
                  const pct = (c.cantidad / max) * 100
                  const color = CATEGORY_COLORS[c.categoria] || "#c4b5fd"
                  return (
                    <div key={c.categoria}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-stone-700">{c.categoria}</span>
                        <span className="text-xs text-stone-400 tabular-nums">
                          {c.cantidad} CVs · {Number(c.confianza_promedio || 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-rose-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-white/90 border border-rose-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-rose-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-stone-800">CVs Recientes</h2>
              <Link to="/admin/cv/historial" className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1">
                Ver todos <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-rose-100">
              {recientes.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-400">No hay CVs analizados recientemente.</div>
              ) : (
                recientes.map(cv => (
                  <div key={cv.id} className="px-6 py-4 hover:bg-rose-50/60 flex items-center gap-4 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center shrink-0 border border-violet-200/50">
                      <Files className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm truncate">{cv.filename}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {new Date(cv.created_at).toLocaleString("es-PE")}
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${getBadge(cv.categoria)}`}>
                        {cv.categoria}
                      </span>
                      <span className="text-sm font-semibold text-stone-700 tabular-nums">{cv.confianza?.toFixed(1)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white/90 border border-rose-200 rounded-2xl p-12 lg:p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center mx-auto mb-5 border border-violet-200/50">
            <Files className="w-8 h-8 text-violet-500" />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">No hay CVs analizados todavía</h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto mb-6">
            Sube tu primer currículum para ver las métricas y estadísticas.
          </p>
          <Link
            to="/admin/cv"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" /> Analizar un CV
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    violet: "from-violet-200/60 to-violet-100/30 text-violet-600",
    fuchsia: "from-fuchsia-200/60 to-fuchsia-100/30 text-fuchsia-600",
    cyan: "from-cyan-200/60 to-cyan-100/30 text-cyan-600",
    emerald: "from-emerald-200/60 to-emerald-100/30 text-emerald-600",
  }
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border border-rose-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <Icon className="w-5 h-5 mb-3" />
      <p className="text-3xl font-bold text-stone-800 tabular-nums">{value}</p>
      <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  )
}
