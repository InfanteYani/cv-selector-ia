import { useState } from "react"
import {
  BadgeCheck, ArrowUp, Crosshair, Sparkles, ScrollText, Verified, CloudUpload, ChartNoAxesColumn
} from "lucide-react"
import FileUpload from "../components/FileUpload.jsx"
import BarLineChart from "../components/BarLineChart.jsx"
import { uploadCV } from "../lib/api.js"

const categoryColors = {
  "Data Science": "from-cyan-300 to-blue-400",
  "HR": "from-pink-300 to-rose-400",
  "Advocate": "from-amber-300 to-orange-400",
  "Arts": "from-purple-300 to-violet-400",
  "Marketing": "from-emerald-300 to-teal-400",
  "Finance": "from-green-300 to-emerald-400",
  "Engineering": "from-blue-300 to-indigo-400",
  "Sales": "from-yellow-300 to-amber-400",
  "Healthcare": "from-red-300 to-rose-400",
  "IT": "from-sky-300 to-cyan-400",
}

const categoryBadges = {
  "Data Science": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "HR": "bg-pink-100 text-pink-700 border-pink-200",
  "Advocate": "bg-amber-100 text-amber-700 border-amber-200",
  "Arts": "bg-purple-100 text-purple-700 border-purple-200",
  "Marketing": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Finance": "bg-green-100 text-green-700 border-green-200",
  "Engineering": "bg-blue-100 text-blue-700 border-blue-200",
  "Sales": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Healthcare": "bg-red-100 text-red-700 border-red-200",
  "IT": "bg-sky-100 text-sky-700 border-sky-200",
}

function getCategoryColor(category) {
  return categoryColors[category] || "from-stone-300 to-stone-400"
}

function getBadge(cat) {
  return categoryBadges[cat] || "bg-stone-100 text-stone-600 border-stone-200"
}

const demoData = [
  { key: "Data Science", metric1: 0, metric2: 0 },
  { key: "Engineering", metric1: 0, metric2: 0 },
  { key: "Marketing", metric1: 0, metric2: 0 },
  { key: "HR", metric1: 0, metric2: 0 },
  { key: "Finance", metric1: 0, metric2: 0 },
]

export default function CVAnalyzer() {
  const [result, setResult] = useState(null)
  const [chartData, setChartData] = useState(demoData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  const handleAnalyze = async (file) => {
    setLoading(true)
    setError("")
    setResult(null)
    setChartData(demoData)
    setSaved(false)

    try {
      const data = await uploadCV(file)
      setResult(data)
      setSaved(true)

      if (data.probabilidades) {
        const sorted = [...data.probabilidades].slice(0, 8)
        const maxProb = sorted[0]?.confianza || 1
        setChartData(sorted.map((p, i) => ({
          key: p.categoria.length > 12 ? p.categoria.slice(0, 12) + "…" : p.categoria,
          metric1: p.confianza,
          metric2: parseFloat((maxProb * (1 - i * 0.08)).toFixed(1)),
        })))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Analizar CV con IA</h1>
      </div>
      <p className="text-stone-400 mb-2">
        Red neuronal entrenada con 332 currículos. Los resultados se guardan automáticamente.
      </p>

      <div className="max-w-2xl mx-auto w-full">
        <FileUpload onAnalyze={handleAnalyze} loading={loading} />
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}
        {saved && !loading && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center justify-center gap-2.5">
            <Verified className="w-4 h-4 text-emerald-500" />
            <span>Análisis guardado. ID: <span className="font-mono font-semibold">#{result?.cv_id}</span></span>
          </div>
        )}
      </div>

      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`rounded-2xl bg-gradient-to-br ${getCategoryColor(result.categoria_detectada)} p-[1px] shadow-md`}>
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Categoría Detectada</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-xl font-bold text-stone-800">{result.categoria_detectada}</h3>
                    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${getBadge(result.categoria_detectada)}`}>
                      {result.confianza}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 text-center border border-rose-100">
                  <ArrowUp className="w-5 h-5 text-violet-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800 tabular-nums">{result.confianza}%</p>
                  <p className="text-xs text-stone-400 mt-1">Confianza</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 text-center border border-rose-100">
                  <Crosshair className="w-5 h-5 text-violet-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-stone-800 tabular-nums">{result.probabilidades.length}</p>
                  <p className="text-xs text-stone-400 mt-1">Categorías</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 text-center border border-rose-100">
                  <Verified className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-stone-800">OK</p>
                  <p className="text-xs text-stone-400 mt-1">Estado</p>
                </div>
              </div>

              <div className="mt-4 w-full bg-rose-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(result.categoria_detectada)}`}
                  style={{ width: `${result.confianza}%` }}
                />
              </div>

              <p className="mt-4 text-sm text-stone-500 text-center">{result.mensaje}</p>
            </div>
          </div>

          <div className="bg-white/90 border border-rose-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Distribución de Probabilidades
            </h3>
            <BarLineChart
              data={chartData}
              barLabel="Confianza"
              barColor="#c4b5fd"
            />
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="max-w-2xl mx-auto bg-white/80 border border-rose-200/60 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center mx-auto mb-5 border border-violet-200/50">
            <CloudUpload className="w-8 h-8 text-violet-500" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2">Sube un currículum para analizar</h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            El modelo de red neuronal clasificará el perfil profesional entre 10 categorías disponibles.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {Object.keys(categoryColors).map(cat => (
              <span key={cat} className={`inline-flex text-xs px-2.5 py-1 rounded-full border ${getBadge(cat)}`}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
