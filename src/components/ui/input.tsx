import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // placeholder + text
        "placeholder-white text-white selection:bg-white/20 selection:text-white",

        // background + border
        "bg-transparent border border-white",

        // sizing
        "h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",

        // focus state
        "focus-visible:border-white focus-visible:ring-white focus-visible:ring-[3px]",

        // disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // file input (still works with shadcn file input)
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
