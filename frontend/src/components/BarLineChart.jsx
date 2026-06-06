import { max } from "d3"

export default function BarLineChart({ data, barLabel, barColor }) {
  const maxVal = max(data.map((d) => d.metric1)) ?? 1

  return (
    <div className="w-full">
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 flex items-end gap-1.5 px-2">
          {data.map((d, i) => {
            const h = (d.metric1 / maxVal) * 100
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="relative w-full flex justify-center">
                  <div
                    className="w-full max-w-[40px] rounded-t-md transition-all duration-500 ease-out group-hover:opacity-80 cursor-pointer"
                    style={{
                      height: `${Math.max(h, 2)}%`,
                      background: `linear-gradient(180deg, ${barColor || "#c4b5fd"}, ${barColor || "#c4b5fd"}66)`,
                    }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.metric1.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 mt-2 truncate w-full text-center">
                  {d.key.length > 10 ? d.key.slice(0, 10) + "…" : d.key}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
