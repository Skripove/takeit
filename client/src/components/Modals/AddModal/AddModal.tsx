import * as React from "react";
import { useState, useEffect } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import type { KeyboardEvent } from "react-native";
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
const MIN_MODAL_HEIGHT = 160; // минимальная высота модалки, чтобы не схлопывалась

const AddModal: React.FC<AddModalProps> = ({
  title,
  onSubmit,
  onDismiss,
  multiline = false,
  ...props
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [kbHeight, setKbHeight] = useState(0); // высота клавиатуры

  const topMargin = insets.top;
  const KEYBOARD_GAP = Math.max(insets.bottom, 12); // зазор между клавой и модалкой

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent) => {
      const { endCoordinates } = e;
      const h =
        Platform.OS === "ios"
          ? Math.max(0, winH - endCoordinates.screenY)
          : Math.max(0, endCoordinates.height);
      setKbHeight(h);
    };
    const onHide = () => setKbHeight(0);

    const s = Keyboard.addListener(showEvent, onShow);
    const h = Keyboard.addListener(hideEvent, onHide);
    return () => {
      s.remove();
      h.remove();
    };
  }, [winH]);

  // Максимальная высота модалки: свободное пространство над клавиатурой (минус GAP)
  const maxModalHeight =
    kbHeight > 0
      ? Math.max(MIN_MODAL_HEIGHT, winH - kbHeight - topMargin - KEYBOARD_GAP)
      : undefined;

  // Чтобы TextInput не «выпирал» и не менял высоту модалки — ограничим его.
  // Берём разумную долю от доступной высоты. Можно подстроить под дизайн.
  const maxInputHeight =
    kbHeight > 0
      ? Math.max(120, Math.floor((maxModalHeight ?? winH) * 0.6))
      : 240;

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
            maxHeight: maxModalHeight,
          },
        ]}
        {...props}
      >
        <View style={[styles.innerClip, { borderRadius: RADIUS }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={topMargin + KEYBOARD_GAP}
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
                style={multiline ? { maxHeight: maxInputHeight } : undefined}
                contentStyle={
                  multiline ? { textAlignVertical: "top" } : undefined
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
