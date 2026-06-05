import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FileText, Loader2, TrendingUp, Brain, BarChart3, History
} from "lucide-react"
import { api } from "../lib/api.js"
import BarLineChart from "../components/BarLineChart.jsx"

const CATEGORY_COLORS = {
  "Data Science": "#06b6d4",
  "Engineering": "#3b82f6",
  "Marketing": "#10b981",
  "HR": "#ec4899",
  "Finance": "#22c55e",
  "Advocate": "#f59e0b",
  "Arts": "#a855f7",
  "Sales": "#eab308",
  "Healthcare": "#ef4444",
  "IT": "#0ea5e9",
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
      <div className="p-8 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  const chartData = stats?.por_categoria.map(c => ({
    key: c.categoria,
    metric1: Number((c.confianza_promedio || 0).toFixed(1)),
    metric2: c.cantidad * 10,
  })) || []

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Panel</h1>
          <p className="text-zinc-500 mt-1">Resumen del análisis de currículos con IA</p>
        </div>
        <Link
          to="/admin/cv/historial"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors border border-zinc-700"
        >
          <History className="w-4 h-4" /> Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="CVs Analizados"
          value={stats?.total || 0}
          color="violet"
        />
        <StatCard
          icon={TrendingUp}
          label="Confianza Promedio"
          value={`${stats?.confianza_promedio || 0}%`}
          color="fuchsia"
        />
        <StatCard
          icon={Brain}
          label="Categorías"
          value={stats?.por_categoria.length || 0}
          color="cyan"
        />
        <StatCard
          icon={BarChart3}
          label="Últimos 7 días"
          value={stats?.ultimos_7_dias.reduce((acc, d) => acc + d.cantidad, 0) || 0}
          color="emerald"
        />
      </div>

      {stats?.total > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Distribución por Categoría
              </h3>
              <BarLineChart
                data={chartData}
                barLabel="Confianza"
                lineLabel="Volumen"
                barColor="#a78bfa"
                lineColor="#f472b6"
              />
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-violet-400/60" />
                  <span>Confianza promedio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 rounded bg-pink-400" />
                  <span>Volumen</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                Top Categorías
              </h3>
              <div className="space-y-3 mt-4">
                {stats.por_categoria.slice(0, 6).map(c => {
                  const max = Math.max(...stats.por_categoria.map(x => x.cantidad))
                  const pct = (c.cantidad / max) * 100
                  const color = CATEGORY_COLORS[c.categoria] || "#a78bfa"
                  return (
                    <div key={c.categoria}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-zinc-300">{c.categoria}</span>
                        <span className="text-zinc-500">
                          {c.cantidad} CVs • {Number(c.confianza_promedio || 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">CVs Recientes</h2>
              <Link to="/admin/cv/historial" className="text-sm text-violet-400 hover:text-violet-300">
                Ver todos →
              </Link>
            </div>
            <div className="divide-y divide-zinc-800">
              {recientes.map(cv => (
                <div key={cv.id} className="p-4 hover:bg-zinc-800/30 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-100 text-sm truncate">{cv.filename}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(cv.created_at).toLocaleString("es-PE")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-zinc-100 text-sm">{cv.categoria}</p>
                    <p className="text-xs text-zinc-500">{cv.confianza?.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-16 text-center">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-300 font-medium">No hay CVs analizados todavía</p>
          <p className="text-sm text-zinc-500 mt-1 mb-4">
            Sube tu primer currículum para ver las métricas y estadísticas
          </p>
          <Link
            to="/admin/cv"
            className="inline-block px-4 py-2 bg-violet-500 text-white rounded-lg text-sm hover:bg-violet-600"
          >
            Analizar un CV
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    violet: "from-violet-500/20 to-violet-500/5 text-violet-400",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
  }
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border border-zinc-800/60 rounded-2xl p-5`}>
      <Icon className="w-5 h-5 mb-3" />
      <p className="text-3xl font-bold text-zinc-100">{value}</p>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  )
}
