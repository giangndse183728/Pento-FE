import * as React from "react"

interface BlurCardProps {
    children: React.ReactNode
    className?: string
    width?: number | string
    height?: number | string
    style?: React.CSSProperties
}

export function BlurCard({ children, className = "", width, height, style = {} }: BlurCardProps) {
    const resolvedStyle: React.CSSProperties = {
        ...(width && { width: typeof width === "number" ? `${width}px` : width }),
        ...(height && { height: typeof height === "number" ? `${height}px` : height }),
        ...style,
    }

    return (
        <div
            className={`overflow-hidden rounded-2xl backdrop-blur bg-black/30 shadow-xl border border-white/40 ${className}`}
            style={resolvedStyle}
        >
            {children}
        </div>
    )
}
