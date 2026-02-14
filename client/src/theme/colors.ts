import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import { lightFonts, darkFonts } from "@/theme/fonts";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts: lightFonts,
  colors: {
    ...MD3LightTheme.colors,

    // Primary
    primary: "#2563EB",
    onPrimary: "#FFFFFF",
    primaryContainer: "#E2E8FF",
    onPrimaryContainer: "#1E3A8A",
    inversePrimary: "#A4C2FF",

    // Secondary / Tertiary
    secondary: "#475569",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E2E8F0",
    onSecondaryContainer: "#1F2937",

    tertiary: "#16A34A",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#DCFCE7",
    onTertiaryContainer: "#14532D",

    // Surfaces / Background
    background: "#FFFFFF",
    onBackground: "#1F2933",
    surface: "#FFFFFF",
    onSurface: "#1F2933",
    surfaceVariant: "#E5E7EB",
    onSurfaceVariant: "#4B5563",

    // Outline / Error / Inverse
    outline: "#94A3B8",
    outlineVariant: "#CBD5E1",
    error: "#B91C1C",
    onError: "#FFFFFF",
    errorContainer: "#FEE2E2",
    onErrorContainer: "#7F1D1D",
    inverseSurface: "#111827",
    inverseOnSurface: "#F1F5F9",

    // Доп. стандартные ключи у RNP (если есть в твоей версии)
    surfaceDisabled: MD3LightTheme.colors.surfaceDisabled,
    onSurfaceDisabled: MD3LightTheme.colors.onSurfaceDisabled,
    backdrop: MD3LightTheme.colors.backdrop,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts: darkFonts,
  colors: {
    ...MD3DarkTheme.colors,

    // Primary
    primary: "#93B2FF",
    onPrimary: "#0A1E4F",
    primaryContainer: "#1E3A8A",
    onPrimaryContainer: "#E2E8FF",
    inversePrimary: "#2563EB",

    // Secondary / Tertiary
    secondary: "#B8C2D4",
    onSecondary: "#141B24",
    secondaryContainer: "#28303D",
    onSecondaryContainer: "#E2E8F0",

    tertiary: "#5AE287",
    onTertiary: "#0E2415",
    tertiaryContainer: "#14532D",
    onTertiaryContainer: "#D1FADF",

    // Surfaces / Background
    background: "#0B0F14",
    onBackground: "#E5EAF0",
    surface: "#0F141B",
    onSurface: "#E5EAF0",
    surfaceVariant: "#1F2933",
    onSurfaceVariant: "#B8C2D4",

    // Outline / Error / Inverse
    outline: "#556070",
    outlineVariant: "#2F3946",
    error: "#FCA5A5",
    onError: "#450A0A",
    errorContainer: "#7F1D1D",
    onErrorContainer: "#FEE2E2",
    inverseSurface: "#E5EAF0",
    inverseOnSurface: "#0C1118",

    // Доп. стандартные ключи (если есть)
    surfaceDisabled: MD3DarkTheme.colors.surfaceDisabled,
    onSurfaceDisabled: MD3DarkTheme.colors.onSurfaceDisabled,
    backdrop: MD3DarkTheme.colors.backdrop,
  },
};
