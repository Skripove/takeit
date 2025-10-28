import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  useTheme,
  Portal,
  Modal,
  Text,
  TextInput,
  IconButton,
  Button,
} from "react-native-paper";

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
          },
        ]}
        {...props}
        onDismiss={onClose}
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
