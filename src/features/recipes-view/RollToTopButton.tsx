"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { ColorTheme } from "@/constants/color";

interface RollToTopButtonProps {
    /** Scroll offset before showing button */
    showAfter?: number;
}

const RollToTopButton: React.FC<RollToTopButtonProps> = ({ showAfter = 240 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > showAfter);
        };
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [showAfter]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={
                "fixed bottom-6 right-16 md:bottom-8 md:right-24 z-50 transition-opacity duration-200 " +
                (visible ? "opacity-100" : "opacity-0 pointer-events-none")
            }
            style={{
                backgroundColor: ColorTheme.darkBlue,
                color: "white",
                borderRadius: "9999px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                padding: "12px"
            }}
        >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
    );
};

export default RollToTopButton;
