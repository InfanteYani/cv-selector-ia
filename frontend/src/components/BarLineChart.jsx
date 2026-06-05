import { scaleBand, scaleLinear, max, line as d3_line, min, curveMonotoneX } from "d3"
import { ClientTooltip, TooltipContent, TooltipTrigger } from "./ClientTooltip"

export default function BarLineChart({ data, barLabel, lineLabel, barColor, lineColor }) {
  const minBars = 6
  const filledData = [
    ...data,
    ...Array.from({ length: Math.max(0, minBars - data.length) }, (_, i) => ({
      key: `Empty ${i + 1}`,
      metric1: 0,
      metric2: 0,
    })),
  ]
  const maxMetric1 = max(data.map((d) => d.metric1)) ?? 0
  const maxMetric2 = max(data.map((d) => d.metric2)) ?? 0
  const minMetric2 = min(data.map((d) => d.metric2)) ?? 0

  const barMax = Math.max(maxMetric1, 1) * 1.15
  const lineMax = Math.max(maxMetric2, 1) * 1.15
  const lineMin = Math.min(minMetric2, 0)

  const xScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.3)

  const yScaleBar = scaleLinear().domain([0, barMax]).range([100, 0])
  const yScaleLine = scaleLinear().domain([lineMin, lineMax]).range([100, 0])

  const lineFn = d3_line()
    .x((d) => {
      const xPos = xScale(d.key) ?? 0
      const bw = xScale.bandwidth() ?? 0
      return xPos + bw / 2
    })
    .y((d) => yScaleLine(d.metric2))
    .curve(curveMonotoneX)

  const pathData = lineFn(data)

  return (
    <div className="relative h-72 w-full"
      style={{
        "--marginTop": "0px",
        "--marginRight": "25px",
        "--marginBottom": "55px",
        "--marginLeft": "25px",
      }}
    >
      <div className="absolute h-[calc(100%-var(--marginTop)-var(--marginBottom))] translate-y-[var(--marginTop)] w-[var(--marginLeft)] left-0 overflow-visible">
        {yScaleBar.ticks(6).map(yScaleBar.tickFormat(6, "d")).map((value, i) => (
          <div key={i} style={{ right: "0%", top: `${yScaleBar(+value)}%` }}
            className="absolute -translate-y-1/2 text-xs tabular-nums text-zinc-500 text-right w-full">
            {value}%
          </div>
        ))}
      </div>

      <div className="absolute h-[calc(100%-var(--marginTop)-var(--marginBottom))] translate-y-[var(--marginTop)] w-[var(--marginRight)] right-0 overflow-visible">
        {yScaleLine.ticks(6).map(yScaleLine.tickFormat(6, "d")).map((value, i) => (
          <div key={i} style={{ left: "0%", top: `${yScaleLine(+value)}%` }}
            className="absolute -translate-y-1/2 text-xs tabular-nums text-zinc-500 w-full text-left pl-2">
            {value}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-10 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        <div className="relative w-full h-full z-10">
          {filledData.map((d, index) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yScaleBar(0) - yScaleBar(d.metric1)
            const isReal = d.metric1 > 0 || d.metric2 > 0

            return (
              <div key={index} className="contents">
                {isReal && (
                  <ClientTooltip>
                    <TooltipTrigger>
                      <div style={{ width: `${barWidth}%`, height: "100%", marginLeft: `${xScale(d.key)}%` }}
                        className="absolute bottom-0 z-10 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs text-zinc-400 mb-1">{d.key}</div>
                      <div className="flex gap-4">
                        <div className="flex gap-1.5 items-center text-sm">
                          <div className="h-3 w-1 rounded-full" style={{ backgroundColor: barColor }}></div>
                          <span>{barLabel}: {d.metric1.toFixed(1)}%</span>
                        </div>
                        <div className="flex gap-1.5 items-center text-sm">
                          <div className="h-3 w-1 rounded-full" style={{ backgroundColor: lineColor }}></div>
                          <span>{lineLabel}: {d.metric2.toFixed(1)}</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </ClientTooltip>
                )}

                {d.metric1 > 0 && (
                  <div style={{
                    width: `${barWidth}%`,
                    height: `${barHeight}%`,
                    marginLeft: `${xScale(d.key)}%`,
                    background: `linear-gradient(to top, ${barColor}44, ${barColor})`,
                  }}
                    className="absolute bottom-0 rounded-sm rounded-t-md opacity-90"
                  />
                )}
              </div>
            )
          })}

          {data.map((entry, i) => {
            const xPos = xScale(entry.key) + xScale.bandwidth() / 2
            return (
              <div key={i} className="absolute overflow-visible text-zinc-500"
                style={{ left: `${xPos}%`, top: "100%", transform: "rotate(35deg) translateX(2px) translateY(8px)" }}>
                <div className="absolute text-[11px] -translate-y-1/2 whitespace-nowrap">{entry.key}</div>
              </div>
            )
          })}
        </div>

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20" preserveAspectRatio="none">
          <path d={pathData ?? ""} fill="none" stroke={lineColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  )
}
