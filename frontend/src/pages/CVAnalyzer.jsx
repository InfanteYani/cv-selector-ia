import { useState } from "react"
import {
  Briefcase, TrendingUp, Target, Loader2, Brain, FileText, CheckCircle2
} from "lucide-react"
import FileUpload from "../components/FileUpload.jsx"
import BarLineChart from "../components/BarLineChart.jsx"
import { uploadCV } from "../lib/api.js"

const categoryColors = {
  "Data Science": "from-cyan-500 to-blue-600",
  "HR": "from-pink-500 to-rose-600",
  "Advocate": "from-amber-500 to-orange-600",
  "Arts": "from-purple-500 to-violet-600",
  "Marketing": "from-emerald-500 to-teal-600",
  "Finance": "from-green-500 to-emerald-600",
  "Engineering": "from-blue-500 to-indigo-600",
  "Sales": "from-yellow-500 to-amber-600",
  "Healthcare": "from-red-500 to-rose-600",
  "IT": "from-sky-500 to-cyan-600",
}

function getCategoryColor(category) {
  return categoryColors[category] || "from-zinc-500 to-zinc-600"
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-100">Analizar CV con IA</h1>
      </div>
      <p className="text-zinc-500 mb-8">
        Red neuronal entrenada con 332 currículos. Los resultados se guardan automáticamente en la base de datos.
      </p>

      <div className="max-w-2xl mx-auto mb-8">
        <FileUpload onAnalyze={handleAnalyze} loading={loading} />
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {saved && !loading && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-4 h-4" />
            Análisis guardado en la base de datos. ID: #{result?.cv_id}
          </div>
        )}
      </div>

      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`rounded-2xl bg-gradient-to-br ${getCategoryColor(result.categoria_detectada)} p-[1px]`}>
            <div className="rounded-2xl bg-zinc-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Categoría Detectada</p>
                  <h3 className="text-xl font-bold text-zinc-100">{result.categoria_detectada}</h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-100">{result.confianza}%</p>
                  <p className="text-xs text-zinc-500 mt-1">Confianza</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                  <Target className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-100">{result.probabilidades.length}</p>
                  <p className="text-xs text-zinc-500 mt-1">Categorías</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-zinc-100">OK</p>
                  <p className="text-xs text-zinc-500 mt-1">Estado</p>
                </div>
              </div>

              <div className="mt-4 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(result.categoria_detectada)}`}
                  style={{ width: `${result.confianza}%` }}
                />
              </div>

              <p className="mt-4 text-sm text-zinc-400 text-center">{result.mensaje}</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Distribución de Probabilidades
            </h3>
            <BarLineChart
              data={chartData}
              barLabel="Confianza"
              lineLabel="Tendencia"
              barColor="#a78bfa"
              lineColor="#f472b6"
            />
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-violet-400/60" />
                <span>Confianza</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 rounded bg-pink-400" />
                <span>Tendencia</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="max-w-2xl mx-auto bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 text-center">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">
            Sube un CV en PDF y el modelo de red neuronal clasificará el perfil profesional.
            <br />
            Categorías: Data Science, HR, Advocate, Arts, Marketing, Engineering, Finance, Sales, Healthcare, IT.
          </p>
        </div>
      )}
    </div>
  )
}
