import * as React from "react";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  useTheme,
  Portal,
  Modal,
  Text,
  TextInput,
  IconButton,
  Button,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AddModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "children"
> & {
  title: string;
  onSubmit: (title: string) => Promise<void>;
  multiline?: boolean;
};

const RADIUS = 16;

const AddModal: React.FC<AddModalProps> = ({
  title,
  onSubmit,
  onDismiss,
  multiline = false,
  ...props
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const topMargin = insets.top;

  const submitHandler = async () => {
    const trimText = text.trim();
    if (!trimText) return;
    try {
      setLoading(true);
      await onSubmit(trimText);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (loading) return;
    onDismiss?.();
    setText("");
  };

  return (
    <Portal>
      <Modal
        onDismiss={onClose}
        style={{ justifyContent: "flex-start" }}
        contentContainerStyle={[
          styles.cardSurface,
          {
            marginHorizontal: 16,
            marginTop: topMargin,
            backgroundColor: theme.colors.surface,
          },
        ]}
        {...props}
      >
        <View style={[styles.innerClip, { borderRadius: RADIUS }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flexGrow: 0 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                padding: 20,
                gap: 16,
              }}
            >
              <IconButton
                icon="close"
                onPress={onClose}
                style={{ alignSelf: "flex-end" }}
                accessibilityLabel="Close"
                disabled={loading}
              />

              <Text variant="titleLarge">{title}</Text>

              <TextInput
                mode="outlined"
                value={text}
                onChangeText={setText}
                autoFocus
                disabled={loading}
                returnKeyType="default"
                // multiline
                multiline={multiline}
                numberOfLines={multiline ? 6 : 1}
                scrollEnabled={multiline}
                contentStyle={
                  multiline
                    ? {
                        textAlignVertical: "top",
                        paddingTop: 8,
                        paddingBottom: 8,
                      }
                    : undefined
                }
              />

              <Button
                mode="contained"
                loading={loading}
                disabled={!text || loading}
                onPress={submitHandler}
                contentStyle={{ height: 56 }}
              >
                Add
              </Button>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </Portal>
  );
};

export default AddModal;

const styles = StyleSheet.create({
  // Это уходит в Surface (контейнер модалки). Тут только скругления и тень.
  cardSurface: {
    borderRadius: RADIUS,
    // overflow сюда НЕ ставим — иначе обрежется тень
  },
  // Внутренняя обертка, которая режет содержимое по скруглению
  innerClip: {
    overflow: "hidden",
    maxHeight: "100%", // важно, чтобы обертка не росла выше Surface:
  },
});
