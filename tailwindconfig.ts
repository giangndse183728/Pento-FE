// tailwind.config.ts
import type { Config } from "tailwindcss"
import { colorTheme } from "@/constant/colorTheme"

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                iceberg: colorTheme.iceberg,
                babyBlue: colorTheme.babyBlue,
                powderBlue: colorTheme.powderBlue,
                blueGray: colorTheme.blueGray,
                primary: {
                    DEFAULT: '#769FCD',
                    foreground: '#FFFFFF',
                },
            },
        },
    },
    plugins: [],
}
export default config
