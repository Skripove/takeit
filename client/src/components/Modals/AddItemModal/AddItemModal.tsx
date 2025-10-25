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

export type AddItemModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "children"
> & {
  onSubmit: (title: string) => Promise<void>;
};

const AddItemModal: React.FC<AddItemModalProps> = ({
  onSubmit,
  onDismiss,
  ...props
}) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const submitHandler = async () => {
    if (!title) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(title);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (loading) return;
    onDismiss?.();
    setTitle("");
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
        <View style={{ gap: 50 }}>
          <TextInput
            mode="outlined"
            label="Title"
            value={title}
            onChangeText={setTitle}
            autoFocus
            disabled={loading}
          />
          <Button
            mode="contained"
            loading={loading}
            disabled={!title || loading}
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

export default AddItemModal;

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
});
