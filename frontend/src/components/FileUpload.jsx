import { useRef, useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"

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
          ? "border-violet-400 bg-violet-500/10 scale-[1.02]"
          : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"
        }
        ${loading ? "pointer-events-none opacity-60" : ""}
      `}
    >
      <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} className="hidden" disabled={loading} />

      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-200">Analizando currículum...</p>
            <p className="text-sm text-zinc-500 mt-1">Procesando con inteligencia artificial</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
            {fileName ? (
              <FileText className="w-8 h-8 text-violet-400" />
            ) : (
              <Upload className="w-8 h-8 text-zinc-400" />
            )}
          </div>
          <div>
            {fileName ? (
              <>
                <p className="text-lg font-medium text-violet-300">{fileName}</p>
                <p className="text-sm text-zinc-500 mt-1">Haz clic para cambiar de archivo</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-zinc-200">
                  Arrastra tu CV aquí o <span className="text-violet-400">selecciona un archivo</span>
                </p>
                <p className="text-sm text-zinc-500 mt-1">Solo archivos PDF</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
