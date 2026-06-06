import { Briefcase, TrendingUp, Target, Activity } from "lucide-react"

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

function getCategoryColor(category) {
  return categoryColors[category] || "from-stone-300 to-stone-400"
}

export default function ResultsCard({ result }) {
  if (!result) return null

  const gradient = getCategoryColor(result.categoria_detectada)
  const confidence = result.confianza
  const confidenceLevel = confidence >= 90 ? "Muy Alta" : confidence >= 75 ? "Alta" : confidence >= 60 ? "Moderada" : "Baja"

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-md`}>
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wider">Categoría Detectada</p>
              <h3 className="text-xl font-bold text-stone-800">{result.categoria_detectada}</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 text-center border border-rose-100">
              <TrendingUp className="w-5 h-5 text-violet-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">{confidence.toFixed(1)}%</p>
              <p className="text-xs text-stone-400 mt-1">Confianza</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 text-center border border-rose-100">
              <Target className="w-5 h-5 text-violet-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-stone-800">{confidenceLevel}</p>
              <p className="text-xs text-stone-400 mt-1">Nivel</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 text-center border border-rose-100">
              <Activity className="w-5 h-5 text-violet-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-stone-800">Preciso</p>
              <p className="text-xs text-stone-400 mt-1">Estado</p>
            </div>
          </div>

          <div className="mt-4 w-full bg-rose-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="mt-4 text-sm text-stone-500 text-center">{result.mensaje}</p>
        </div>
      </div>
    </div>
  )
}
