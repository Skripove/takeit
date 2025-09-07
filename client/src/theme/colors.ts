import { DefaultTheme, MD3DarkTheme } from "react-native-paper";

export const lightColors = {
  primary: "#ffdd33",
  primary_content: "#332a00",
  primary_dark: "#ffd500",
  primary_light: "#ffe666",

  secondary: "#3355ff",
  secondary_content: "#ffffff",
  secondary_dark: "#002aff",
  secondary_light: "#667fff",

  background: "#f2f1ed",
  surface: "#fcfcfb",
  border: "#e4e2da",

  copy: "#2c2a21",
  copy_light: "#757057",
  copy_lighter: "#9d987b",

  success: "#33ff33",
  warning: "#ffff33",
  error: "#ff3333",
  success_content: "#003300",
  warning_content: "#333300",
  error_content: "#ffffff",
};

export const darkColors = {
  primary: "#ffdd33",
  primary_content: "#332a00",
  primary_dark: "#ffd500",
  primary_light: "#ffe666",

  secondary: "#3355ff",
  secondary_content: "#ffffff",
  secondary_dark: "#002aff",
  secondary_light: "#667fff",

  background: "#1d1c16",
  surface: "#2c2a21",
  border: "#494636",

  copy: "#fcfcfb",
  copy_light: "#deddd3",
  copy_lighter: "#b3af98",

  success: "#33ff33",
  warning: "#ffff33",
  error: "#ff3333",
  success_content: "#003300",
  warning_content: "#333300",
  error_content: "#ffffff",
};

// Светлая тема
export const lightTheme = {
  ...DefaultTheme,
  // colors: {
  //   ...DefaultTheme.colors,

  //   // базовые
  //   primary: lightColors.primary,
  //   secondary: lightColors.secondary,
  //   background: lightColors.background,
  //   surface: lightColors.surface,
  //   error: lightColors.error,

  //   // текст
  //   text: lightColors.copy,
  //   onSurface: lightColors.copy,
  //   onBackground: lightColors.copy,
  //   placeholder: lightColors.copy_light,

  //   // бордеры
  //   outline: lightColors.border,

  //   // статусы
  //   success: lightColors.success,
  //   onSuccess: lightColors.success_content,
  //   warning: lightColors.warning,
  //   onWarning: lightColors.warning_content,
  //   onError: lightColors.error_content,
  // },
};

// Тёмная тема
export const darkTheme = {
  ...MD3DarkTheme,
  // colors: {
  //   ...MD3DarkTheme.colors,

  //   // базовые
  //   primary: darkColors.primary,
  //   secondary: darkColors.secondary,
  //   background: darkColors.background,
  //   surface: darkColors.surface,
  //   error: darkColors.error,

  //   // текст
  //   text: darkColors.copy,
  //   onSurface: darkColors.copy,
  //   onBackground: darkColors.copy,
  //   placeholder: darkColors.copy_light,

  //   // бордеры
  //   outline: darkColors.border,

  //   // статусы
  //   success: darkColors.success,
  //   onSuccess: darkColors.success_content,
  //   warning: darkColors.warning,
  //   onWarning: darkColors.warning_content,
  //   onError: darkColors.error_content,
  // },
};
