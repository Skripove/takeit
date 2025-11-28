import { MD3DarkTheme, MD3LightTheme, configureFonts } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

type FontsConfig = Omit<MD3Theme["fonts"], "default">;

const pickFamily = (weight?: string) => {
  return "Inter";
};

const buildFonts = (base: MD3Theme["fonts"]) => {
  const mapped = Object.fromEntries(
    Object.entries(base)
      .filter(([key]) => key !== "default")
      .map(([key, font]) => [
        key,
        {
          ...font,
        fontFamily: pickFamily(font.fontWeight),
      },
    ])
  ) as FontsConfig;

  return configureFonts({ config: mapped });
};

export const lightFonts = buildFonts(MD3LightTheme.fonts);
export const darkFonts = buildFonts(MD3DarkTheme.fonts);
