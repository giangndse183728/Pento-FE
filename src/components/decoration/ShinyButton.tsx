"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "./ShinyButton.css"; // hover shine effect

const shinyButtonVariants = cva(
    "inline-flex items-center justify-center gap-2, whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 shadow-md hover:shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-[#769FCD] text-white hover:bg-[#8CB4E8]",
                outline:
                    "border-2 border-[#769FCD] text-[#769FCD] hover:bg-[#769FCD] hover:text-white",
            },
            size: {
                default: "h-12 px-6 py-3",
                lg: "h-14 px-8 py-4",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface ShinyButtonProps
    extends React.ComponentProps<"button">,
    VariantProps<typeof shinyButtonVariants> {
    text: string;
    asChild?: boolean;
}

export function ShinyButton({
    text,
    className,
    variant,
    size,
    asChild = false,
    ...props
}: ShinyButtonProps) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            className={cn(
                shinyButtonVariants({ variant, size, className }),
                "shiny-button"
            )}
            {...props}
        >
            {text}
        </Comp>
    );
}
