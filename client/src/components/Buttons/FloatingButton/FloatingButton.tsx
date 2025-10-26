import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

export enum FABPosition {
  fabBottomCenter = "fabBottomCenter",
  fabBottomRight = "fabBottomRight",
}

export type FloatingButtonProps = React.ComponentProps<typeof FAB> & {
  position?: FABPosition;
};

const FloatingButton: React.FC<FloatingButtonProps> = ({
  position = FABPosition.fabBottomCenter,
  style,
  ...props
}) => {
  return <FAB style={[styles[position], style]} {...props} />;
};

export default FloatingButton;

// Styles
const styles = StyleSheet.create({
  fabBottomCenter: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  fabBottomRight: {
    position: "absolute",
    bottom: 16,
    right: 12,
    alignSelf: "flex-end",
  },
});
