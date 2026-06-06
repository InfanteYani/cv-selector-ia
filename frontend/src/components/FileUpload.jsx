import { useRef, useState } from "react"
import { Upload, RotateCw } from "lucide-react"

export default function FileUpload({ onAnalyze, loading }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleFile = (file) => {
    if (!file || file.type !== "application/pdf") return
    setFileName(file.name)
    onAnalyze(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
        ${dragOver
          ? "border-violet-400 bg-violet-100/70 scale-[1.02] shadow-md"
          : "border-rose-200 bg-white/80 hover:border-rose-300 hover:bg-rose-50/50"
        }
        ${loading ? "pointer-events-none opacity-60" : ""}
      `}
    >
      <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} className="hidden" disabled={loading} />

      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center border-2 border-violet-200">
            <RotateCw className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-stone-800">Analizando currículum...</p>
            <p className="text-sm text-stone-400 mt-1">Procesando con inteligencia artificial</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center border-2 border-rose-200 transition-colors group-hover:bg-rose-200">
            {fileName ? (
              <FileText className="w-8 h-8 text-violet-600" />
            ) : (
              <Upload className="w-8 h-8 text-stone-400" />
            )}
          </div>
          <div>
            {fileName ? (
              <>
                <p className="text-lg font-semibold text-violet-700">{fileName}</p>
                <p className="text-sm text-stone-400 mt-1">Haz clic para cambiar de archivo</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-stone-700">
                  Arrastra tu CV aquí o <span className="text-violet-600 hover:text-violet-700">selecciona un archivo</span>
                </p>
                <p className="text-sm text-stone-400 mt-1">Solo archivos PDF</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
