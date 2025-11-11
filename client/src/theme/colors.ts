import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    // Primary (коричнево-оранжевый)
    primary: "#A06E3D",
    onPrimary: "#FFFFFF",
    primaryContainer: "#F0DCC9",
    onPrimaryContainer: "#3A2616",
    inversePrimary: "#E0B389",

    // Secondary / Tertiary
    secondary: "#8A7D70",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E9DED4",
    onSecondaryContainer: "#2D261F",

    tertiary: "#A07E5A",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#F1E0D0",
    onTertiaryContainer: "#3A2716",

    // Surfaces / Background
    background: "#FAF3E7",
    onBackground: "#1F1B16",
    surface: "#FFF8EC",
    onSurface: "#1F1B16",
    surfaceVariant: "#EEE3D6",
    onSurfaceVariant: "#51453A",

    // Outline / Error / Inverse
    outline: "#9C8F84",
    outlineVariant: "#D2C5B8",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    inverseSurface: "#2E2A25",
    inverseOnSurface: "#F8EFE4",

    // Доп. стандартные ключи у RNP (если есть в твоей версии)
    surfaceDisabled: MD3LightTheme.colors.surfaceDisabled,
    onSurfaceDisabled: MD3LightTheme.colors.onSurfaceDisabled,
    backdrop: MD3LightTheme.colors.backdrop,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    // Primary (парный к светлому)
    primary: "#E0B389",
    onPrimary: "#3A2616",
    primaryContainer: "#5C3E25",
    onPrimaryContainer: "#F0DCC9",
    inversePrimary: "#A06E3D",

    // Secondary / Tertiary
    secondary: "#D0C4B7",
    onSecondary: "#362E27",
    secondaryContainer: "#51453A",
    onSecondaryContainer: "#E9DED4",

    tertiary: "#E1C2A3",
    onTertiary: "#3D2A1A",
    tertiaryContainer: "#5B4634",
    onTertiaryContainer: "#F1E0D0",

    // Surfaces / Background
    background: "#15130F",
    onBackground: "#EAE1D6",
    surface: "#1C1914",
    onSurface: "#EAE1D6",
    surfaceVariant: "#51453A",
    onSurfaceVariant: "#D2C5B8",

    // Outline / Error / Inverse
    outline: "#9C8F84",
    outlineVariant: "#51453A",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    inverseSurface: "#2E2A25",
    inverseOnSurface: "#F8EFE4",

    // Доп. стандартные ключи (если есть)
    surfaceDisabled: MD3DarkTheme.colors.surfaceDisabled,
    onSurfaceDisabled: MD3DarkTheme.colors.onSurfaceDisabled,
    backdrop: MD3DarkTheme.colors.backdrop,
  },
};
