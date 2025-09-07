import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { lightTheme, darkTheme } from "./src/theme/colors";
import Navigation from "./src/components/Navigation";
import { ItemsProvider } from "./src/provider/ItemsProvider/ItemsProvider";

export default function App() {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        <ItemsProvider>
          <Navigation />
        </ItemsProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
