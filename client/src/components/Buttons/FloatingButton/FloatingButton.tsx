import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

export type FloatingButtonProps = React.ComponentProps<typeof FAB>;

const FloatingButton: React.FC<FloatingButtonProps> = ({ ...props }) => {
  return <FAB style={[styles.fab]} {...props} />;
};

export default FloatingButton;

// Styles
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
});
