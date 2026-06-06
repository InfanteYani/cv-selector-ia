import { max } from "d3"

const PALETTE = [
  "#c4b5fd", "#f9a8d4", "#67e8f9", "#86efac",
  "#fde68a", "#fdba74", "#d8b4fe", "#fca5a5",
  "#7dd3fc", "#93c5fd",
]

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`
}

export default function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.metric1, 0) || 1
  let currentAngle = 0
  const segments = data.map((d) => {
    const angle = (d.metric1 / total) * 360
    const seg = { ...d, startAngle: currentAngle, endAngle: currentAngle + angle }
    currentAngle += angle
    return seg
  })

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-56 h-56">
        {segments.map((d, i) => {
          const rOuter = 80, rInner = 40
          const start = polarToCartesian(100, 100, rOuter, d.endAngle)
          const end = polarToCartesian(100, 100, rOuter, d.startAngle)
          const large = d.endAngle - d.startAngle > 180 ? 1 : 0
          const outerArc = `A ${rOuter} ${rOuter} 0 ${large} 0 ${end.x} ${end.y}`
          const innerStart = polarToCartesian(100, 100, rInner, d.startAngle)
          const innerEnd = polarToCartesian(100, 100, rInner, d.endAngle)
          const innerArc = `A ${rInner} ${rInner} 0 ${large} 1 ${innerEnd.x} ${innerEnd.y}`
          const path = `M ${start.x} ${start.y} ${outerArc} L ${innerStart.x} ${innerStart.y} ${innerArc} Z`

          return (
            <path
              key={d.key}
              d={path}
              fill={PALETTE[i % PALETTE.length]}
              stroke="white"
              strokeWidth="1.5"
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            >
              <title>{`${d.key}: ${d.metric1.toFixed(1)}%`}</title>
            </path>
          )
        })}
        <circle cx="100" cy="100" r="30" fill="white" />
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4">
        {segments.map((d, i) => (
          <div key={d.key} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
            <span className="text-stone-600">{d.key}</span>
            <span className="text-stone-400 tabular-nums">{d.metric1.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
