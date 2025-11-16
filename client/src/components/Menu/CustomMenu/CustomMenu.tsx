import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Portal, Surface, Text, useTheme } from "react-native-paper";

type Position = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type CustomMenuItem = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  items: CustomMenuItem[];
  position?: Position;
  style?: StyleProp<ViewStyle>;
};

export default function CustomMenu({
  visible,
  onDismiss,
  items,
  position,
  style,
}: Props) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Portal>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback>
            <Surface
              style={[
                styles.menu,
                {
                  backgroundColor: theme.colors.surface,
                },
                position,
                style,
              ]}
              elevation={2}
            >
              {items.map((item, index) => (
                <TouchableOpacity
                  key={`${item.label}-${index}`}
                  onPress={item.onPress}
                  style={styles.menuItem}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.menuItemText,
                      { color: theme.colors.onSurface },
                      item.disabled && { color: theme.colors.onSurfaceDisabled },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </Surface>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Portal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    borderRadius: 8,
    minWidth: 160,
    paddingVertical: 4,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
});
