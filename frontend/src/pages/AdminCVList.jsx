import { useState, useEffect } from "react"
import { Loader2, FileText, Calendar, Brain, ChevronRight, X, BarChart3, Trash2, Quote, FileSearch } from "lucide-react"
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
      <div className="p-8 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">CVs Escaneados</h1>
        </div>
        <p className="text-zinc-500">Historial de currículos analizados con IA (almacenados en SQLite)</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-zinc-800/60 rounded-2xl p-5">
          <FileText className="w-5 h-5 text-violet-400 mb-3" />
          <p className="text-3xl font-bold text-zinc-100">{stats.total}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Total analizados</p>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 border border-zinc-800/60 rounded-2xl p-5">
          <BarChart3 className="w-5 h-5 text-fuchsia-400 mb-3" />
          <p className="text-3xl font-bold text-zinc-100">{stats.confianza.toFixed(1)}%</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Confianza promedio</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-zinc-800/60 rounded-2xl p-5">
          <Brain className="w-5 h-5 text-cyan-400 mb-3" />
          <p className="text-3xl font-bold text-zinc-100">{stats.categorias}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Categorías distintas</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-16 text-center">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-300 font-medium">No hay CVs analizados todavía</p>
          <p className="text-sm text-zinc-500 mt-1">
            Los CVs que se analicen se almacenarán automáticamente en la base de datos.
          </p>
          <a
            href="/admin/cv"
            className="inline-block mt-4 px-4 py-2 bg-violet-500/10 text-violet-300 border border-violet-500/30 rounded-lg text-sm hover:bg-violet-500/20"
          >
            Analizar un CV
          </a>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
          {items.map(cv => (
            <div
              key={cv.id}
              onClick={() => setSelected(cv)}
              className="p-5 hover:bg-zinc-800/30 cursor-pointer transition-colors flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-100 truncate">{cv.filename || `CV #${cv.id}`}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {timeAgo(cv.created_at)}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-zinc-100">{cv.categoria}</p>
                <p className="text-xs text-zinc-500">{cv.confianza?.toFixed(1)}%</p>
              </div>
              <button
                onClick={(e) => eliminar(cv.id, e)}
                className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-zinc-800 flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500 font-mono">#{selected.id}</p>
                <h2 className="text-xl font-bold text-zinc-100 mt-1">{selected.filename || "CV"}</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {new Date(selected.created_at).toLocaleString("es-PE")}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-zinc-800/50 to-zinc-800/20 border border-zinc-700/50 rounded-xl">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Categoría Detectada</p>
                <p className="text-3xl font-bold text-zinc-100 mt-2">{selected.categoria}</p>
                <p className="text-lg text-violet-400 mt-1 font-medium">{selected.confianza?.toFixed(1)}% de confianza</p>
              </div>

              {selected.texto_muestra && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <FileSearch className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">Texto Extraído del PDF</h3>
                      <p className="text-xs text-zinc-500">Contenido que el modelo usó para clasificar</p>
                    </div>
                  </div>
                  <div className="relative bg-zinc-800/40 border border-zinc-700/60 rounded-xl p-5 max-h-80 overflow-y-auto">
                    <Quote className="absolute top-3 left-3 w-6 h-6 text-violet-500/20" />
                    <p className="text-sm text-zinc-200 leading-relaxed pl-8 whitespace-pre-wrap font-mono">
                      {selected.texto_completo || selected.texto_muestra}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    {(selected.texto_completo || selected.texto_muestra || "").length} caracteres extraídos
                  </p>
                </div>
              )}

              {selected.probabilidades && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
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
                                <span className="text-zinc-300 font-medium">{p.categoria}</span>
                                <span className="text-zinc-500 tabular-nums">{p.confianza.toFixed(2)}%</span>
                              </div>
                              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )
                        })
                      } catch {
                        return <p className="text-zinc-500 text-sm">No disponible</p>
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
