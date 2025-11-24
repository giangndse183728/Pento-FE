import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ColorTheme } from "@/constants/color"

const cusButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all shadow-sm hover:shadow disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                blue: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                blueGray: "hover:brightness-110 text-white",
                green: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
                red: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white",
                purple: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white",
                orange: "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white",
                gray: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white",
            },
            size: {
                sm: "px-2 py-1 text-xs",
                default: "px-3 py-2 text-sm",
                lg: "px-4 py-3 text-base",
                xl: "px-6 py-4 text-lg",
                icon: "size-10",
            },
        },
        defaultVariants: {
            variant: "blue",
            size: "default",
        },
    }
)

export interface CusButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cusButtonVariants> {
    asChild?: boolean
}

const CusButton = React.forwardRef<HTMLButtonElement, CusButtonProps>(
    ({ className, variant, size, children, style, ...props }, ref) => {
        const inlineStyle = variant === "blueGray"
            ? { backgroundColor: ColorTheme.blueGray, ...style }
            : style;

        return (
            <button
                ref={ref}
                className={cn(cusButtonVariants({ variant, size, className }))}
                style={inlineStyle}
                {...props}
            >
                {children}
            </button>
        )
    }
)
CusButton.displayName = "CusButton"

export { CusButton, cusButtonVariants }
