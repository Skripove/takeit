import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { lightTheme, darkTheme } from "./src/theme/colors";
import Navigation from "./src/components/Navigation";
import { ItemsProvider } from "./src/provider/ItemsProvider";
import { EventsProvider } from "./src/provider";

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter[slnt,wght].ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        <EventsProvider>
          <ItemsProvider>
            <Navigation />
          </ItemsProvider>
        </EventsProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
