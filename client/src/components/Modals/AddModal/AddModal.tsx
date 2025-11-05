import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
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
};

const AddModal: React.FC<AddModalProps> = ({
  title,
  onSubmit,
  onDismiss,
  ...props
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const topMargin = insets.top + 40;

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const submitHandler = async () => {
    if (!text) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(text);
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
        contentContainerStyle={[
          styles.card,
          {
            marginHorizontal: 16,
            marginTop: topMargin,
          },
        ]}
        onDismiss={onClose}
        style={{ justifyContent: "flex-start" }}
        {...props}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={topMargin}
        >
          <IconButton
            icon="close"
            onPress={onClose}
            style={{ alignSelf: "flex-end" }}
            accessibilityLabel="Close"
            disabled={loading}
          />
          <Text variant="titleLarge">{title}</Text>
          <View style={{ gap: 50 }}>
            <TextInput
              mode="outlined"
              label="Title"
              value={text}
              onChangeText={setText}
              autoFocus
              disabled={loading}
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
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

export default AddModal;

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
});
