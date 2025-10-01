export type ColorHex = `#${string}`;

export interface ColorTheme {
    iceberg: ColorHex; // #F7FBFC
    babyBlue: ColorHex; // #D6E6F2
    powderBlue: ColorHex; // #B9D7EA
    blueGray: ColorHex; // #769FCD (accent)
}

export const colorTheme: ColorTheme = {
    iceberg: '#F7FBFC',
    babyBlue: '#D6E6F2',
    powderBlue: '#B9D7EA',
    blueGray: '#769FCD'
};

export const palettes = {
    coolBlue: [colorTheme.blueGray, colorTheme.powderBlue, colorTheme.babyBlue] as ColorHex[],
    softBlue: [colorTheme.iceberg, colorTheme.babyBlue, colorTheme.powderBlue] as ColorHex[]
};

export type PaletteName = keyof typeof palettes;

