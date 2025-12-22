import * as React from "react"

interface WhiteCardProps {
    children?: React.ReactNode
    className?: string
    width?: number | string
    height?: number | string
    style?: React.CSSProperties
    contentClassName?: string
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function WhiteCard({ children, className = "", width = 500, height = 250, style = {}, contentClassName = "", onClick }: WhiteCardProps) {
    const resolvedStyle: React.CSSProperties = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
    }

    return (
        <div
            className={`relative rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg border border-white/60 overflow-hidden ${className}`}
            onClick={onClick}
        >
            {/* Noise Overlay - preparing to add onClick support */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{
                    backgroundImage: `width='200' height='200'>
              <filter id='noise'>
                <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/>
              </filter>
              <rect width='100%' height='100%' filter='url(%23noise)' />
            </svg>")`,
                }}
            />

            {/* Content */}
            <div className={`relative p-6 ${contentClassName}`}>
                {children}
            </div>
        </div>
    )
}
