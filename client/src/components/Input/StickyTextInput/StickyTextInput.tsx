import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, TextInput, useTheme } from "react-native-paper";
import { KeyboardStickyView } from "react-native-keyboard-controller";

export type StickyTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  /** When provided, submit button is shown and called on press. When omitted, submit button is hidden. */
  onSubmit?: () => void;
  placeholder?: string;
  /** Bottom offset when keyboard is opened (e.g. tabBarHeight - 6). Default -6. */
  keyboardOpenedOffset?: number;
};

const StickyTextInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Add items...",
  keyboardOpenedOffset = -6,
}: StickyTextInputProps) => {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        composer: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 12,
        },
        row: {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 6,
        },
        input: {
          flex: 1,
          maxHeight: 150,
        },
        inputContent: {
          overflow: "hidden",
          borderRadius: 25,
          backgroundColor: theme.colors.primaryContainer,
          opacity: 0.6,
        },
        inputOutline: { borderRadius: 25, borderWidth: 1 },
        submitButton: {
          margin: 0,
          marginBottom: 4,
          opacity: 0.8,
        },
      }),
    [theme.colors.primaryContainer],
  );

  return (
    <KeyboardStickyView
      style={styles.composer}
      offset={{ closed: -6, opened: keyboardOpenedOffset }}
    >
      <View style={styles.row}>
        <TextInput
          mode="outlined"
          dense
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline
          returnKeyType="default"
          style={styles.input}
          contentStyle={styles.inputContent}
          outlineStyle={styles.inputOutline}
        />
        {onSubmit && (
          <IconButton
            icon="plus"
            onPress={onSubmit}
            disabled={!value.trim()}
            mode="outlined"
            containerColor={
              value.trim() ? theme.colors.primaryContainer : undefined
            }
            style={styles.submitButton}
          />
        )}
      </View>
    </KeyboardStickyView>
  );
};

export default StickyTextInput;
