import "react-native-reanimated";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { lightTheme, darkTheme } from "@/theme/colors";
import Navigation from "@/components/Navigation";
import { ItemsProvider } from "@/provider/ItemsProvider";
import { EventsProvider } from "@/provider";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter[slnt,wght].ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={isDark ? darkTheme : lightTheme}>
            <EventsProvider>
              <ItemsProvider>
                <Navigation />
              </ItemsProvider>
            </EventsProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}
