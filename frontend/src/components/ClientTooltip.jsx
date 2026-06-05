import * as React from "react"
import { createPortal } from "react-dom"

const TooltipContext = React.createContext(undefined)

function useTooltipContext(componentName) {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("Please wrap your TooltipContent and TooltipTrigger in a ClientTooltip")
  }
  return context
}

const Tooltip = ({ children }) => {
  const [tooltip, setTooltip] = React.useState()

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>{children}</TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef(({ children }, forwardedRef) => {
  const context = useTooltipContext("TooltipTrigger")
  const triggerRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        context.setTooltip(undefined)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [context])

  return (
    <div
      ref={(node) => {
        triggerRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse") {
          context.setTooltip({ x: event.clientX, y: event.clientY })
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          context.setTooltip(undefined)
        }
      }}
      onTouchStart={(event) => {
        context.setTooltip({ x: event.touches[0].clientX, y: event.touches[0].clientY })
        setTimeout(() => context.setTooltip(undefined), 2000)
      }}
    >
      {children}
    </div>
  )
})

TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ children }, _) => {
  const context = useTooltipContext("TooltipContent")
  const runningOnClient = typeof document !== "undefined"
  const tooltipRef = React.useRef(null)

  const getTooltipPosition = () => {
    if (!tooltipRef.current || !context.tooltip) return {}
    const tw = tooltipRef.current.offsetWidth
    const vw = window.innerWidth
    return {
      top: context.tooltip.y - 20,
      left: context.tooltip.x + tw + 10 > vw ? context.tooltip.x - tw - 10 : context.tooltip.x + 10,
    }
  }

  if (!context.tooltip || !runningOnClient) return null

  return createPortal(
    <div ref={tooltipRef}
      className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg fixed z-50 shadow-xl"
      style={getTooltipPosition()}>
      {children}
    </div>,
    document.body
  )
})

TooltipContent.displayName = "TooltipContent"

export { Tooltip as ClientTooltip, TooltipTrigger, TooltipContent }
