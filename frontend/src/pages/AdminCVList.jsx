import { useState, useEffect } from "react"
import { Files, Clock, Sparkles, ArrowRight, X, ChartBar, Eraser, MessageSquareText, SearchCheck } from "lucide-react"
import { api } from "../lib/api.js"

function timeAgo(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr.replace(" ", "T"))
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return "hace un momento"
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
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

export default function AdminCVList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const cargar = () => {
    setLoading(true)
    api.historialCV()
      .then(d => setItems(d.historial))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const eliminar = async (id, e) => {
    e.stopPropagation()
    if (!confirm("¿Eliminar este análisis de la base de datos?")) return
    await api.eliminarCV(id)
    if (selected?.id === id) setSelected(null)
    cargar()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-300 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-sm text-stone-400">Cargando historial...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: items.length,
    confianza: items.length > 0
      ? items.reduce((acc, x) => acc + (x.confianza || 0), 0) / items.length
      : 0,
    categorias: new Set(items.map(x => x.categoria)).size,
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">CVs Escaneados</h1>
        </div>
        <p className="text-stone-400">Historial de currículos analizados con IA</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-200/60 to-violet-100/30 border border-rose-200/80 rounded-2xl p-5 shadow-sm">
          <Files className="w-5 h-5 text-violet-600 mb-3" />
          <p className="text-3xl font-bold text-stone-800 tabular-nums">{stats.total}</p>
          <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Total analizados</p>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-200/60 to-fuchsia-100/30 border border-rose-200/80 rounded-2xl p-5 shadow-sm">
          <ChartBar className="w-5 h-5 text-fuchsia-600 mb-3" />
          <p className="text-3xl font-bold text-stone-800 tabular-nums">{stats.confianza.toFixed(1)}%</p>
          <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Confianza promedio</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-200/60 to-cyan-100/30 border border-rose-200/80 rounded-2xl p-5 shadow-sm">
          <Sparkles className="w-5 h-5 text-cyan-600 mb-3" />
          <p className="text-3xl font-bold text-stone-800 tabular-nums">{stats.categorias}</p>
          <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Categorías distintas</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white/90 border border-rose-200 rounded-2xl p-12 lg:p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center mx-auto mb-5 border border-violet-200/50">
            <Files className="w-8 h-8 text-violet-500" />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">No hay CVs analizados todavía</h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto mb-6">
            Los CVs que se analicen se almacenarán automáticamente en la base de datos.
          </p>
          <a
            href="/admin/cv"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" /> Analizar un CV
          </a>
        </div>
      ) : (
        <div className="bg-white/90 border border-rose-200 rounded-2xl shadow-sm divide-y divide-rose-100 overflow-hidden">
          {items.map(cv => (
            <div
              key={cv.id}
              onClick={() => setSelected(cv)}
              className="px-6 py-4 hover:bg-rose-50/60 cursor-pointer transition-colors flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center shrink-0 border border-violet-200/50">
                <Files className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm truncate">{cv.filename || `CV #${cv.id}`}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(cv.created_at)}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 flex items-center gap-3">
                <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${getBadge(cv.categoria)}`}>
                  {cv.categoria}
                </span>
                <span className="text-sm font-semibold text-stone-700 tabular-nums">{cv.confianza?.toFixed(1)}%</span>
              </div>
              <button
                onClick={(e) => eliminar(cv.id, e)}
                className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 shrink-0 transition-colors"
                title="Eliminar"
              >
                <Eraser className="w-4 h-4" />
              </button>
              <ArrowRight className="w-5 h-5 text-stone-300" />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-rose-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="px-6 py-4 border-b border-rose-200 flex items-start justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <p className="text-xs text-stone-400 font-mono">#{selected.id}</p>
                <h2 className="text-lg font-bold text-stone-800 mt-0.5">{selected.filename || "CV"}</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {new Date(selected.created_at).toLocaleString("es-PE")}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-rose-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-xl">
                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Categoría Detectada</p>
                <p className="text-3xl font-bold text-stone-800">{selected.categoria}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-2 w-32 bg-rose-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full" style={{ width: `${selected.confianza || 0}%` }} />
                  </div>
                  <span className="text-lg font-bold text-violet-600 tabular-nums">{selected.confianza?.toFixed(1)}%</span>
                </div>
              </div>

              {selected.texto_muestra && (
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                      <SearchCheck className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-800">Texto Extraído del PDF</h3>
                      <p className="text-xs text-stone-400">Contenido utilizado para la clasificación</p>
                    </div>
                  </div>
                  <div className="relative bg-rose-50/70 border border-rose-200/60 rounded-xl p-5 max-h-80 overflow-y-auto">
                    <MessageSquareText className="absolute top-3 left-3 w-6 h-6 text-violet-300/30" />
                    <p className="text-sm text-stone-700 leading-relaxed pl-8 whitespace-pre-wrap font-mono">
                      {selected.texto_completo || selected.texto_muestra}
                    </p>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                    {(selected.texto_completo || selected.texto_muestra || "").length.toLocaleString()} caracteres extraídos
                  </p>
                </div>
              )}

              {selected.probabilidades && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    Distribución de Probabilidades
                  </h3>
                  <div className="space-y-2.5">
                    {(() => {
                      try {
                        const probs = JSON.parse(selected.probabilidades).slice(0, 6)
                        return probs.map(p => {
                          const max = Math.max(...probs.map(x => x.confianza))
                          const pct = (p.confianza / max) * 100
                          return (
                            <div key={p.categoria}>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-stone-700 font-medium">{p.categoria}</span>
                                <span className="text-stone-400 tabular-nums">{p.confianza.toFixed(2)}%</span>
                              </div>
                              <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )
                        })
                      } catch {
                        return <p className="text-stone-500 text-sm">No disponible</p>
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
