import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  useTheme,
  Portal,
  Modal,
  Text,
  IconButton,
  Button,
} from "react-native-paper";

export type DeleteItemModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "children"
> & {
  onSubmit: () => Promise<void>;
};

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  onSubmit,
  onDismiss,
  ...props
}) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    try {
      setLoading(true);
      await onSubmit();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (loading) return;
    onDismiss?.();
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
          <Text variant="titleLarge">
            Are you sure you want to delete selected Items?
          </Text>
          <Button
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={submitHandler}
            contentStyle={{ height: 56 }}
          >
            Delete
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default DeleteItemModal;

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
});
