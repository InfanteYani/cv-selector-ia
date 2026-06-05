import { Briefcase, TrendingUp, Target, Activity } from "lucide-react"

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

export default function ResultsCard({ result }) {
  if (!result) return null

  const gradient = getCategoryColor(result.categoria_detectada)
  const confidence = result.confianza
  const confidenceLevel = confidence >= 90 ? "Muy Alta" : confidence >= 75 ? "Alta" : confidence >= 60 ? "Moderada" : "Baja"

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-[1px]`}>
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
              <p className="text-2xl font-bold text-zinc-100">{confidence.toFixed(1)}%</p>
              <p className="text-xs text-zinc-500 mt-1">Confianza</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <Target className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-zinc-100">{confidenceLevel}</p>
              <p className="text-xs text-zinc-500 mt-1">Nivel</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <Activity className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-zinc-100">Preciso</p>
              <p className="text-xs text-zinc-500 mt-1">Estado</p>
            </div>
          </div>

          <div className="mt-4 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="mt-4 text-sm text-zinc-400 text-center">{result.mensaje}</p>
        </div>
      </div>
    </div>
  )
}
