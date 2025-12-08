export const ColorTheme = {
    iceberg: '#F7FBFC',
    babyBlue: '#D6E6F2',
    powderBlue: '#B9D7EA',
    blueGray: '#769FCD',
    darkBlue: '#113F67',
} as const;

export type ColorTheme = keyof typeof ColorTheme;