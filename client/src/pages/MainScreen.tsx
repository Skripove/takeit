import React from "react";
import { View, StatusBar } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  scroll?: boolean;
  children: React.ReactNode;
};

export default function MainScreen({ children }: Props) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["left", "right"]}
    >
      <StatusBar translucent={false} barStyle="dark-content" />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>{children}</View>
    </SafeAreaView>
  );
}
