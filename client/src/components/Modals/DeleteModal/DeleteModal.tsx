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

export type DeleteModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "children"
> & {
  title: string;
  onSubmit: () => Promise<void>;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
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
            backgroundColor: theme.colors.surface,
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
          <Text variant="titleLarge">{title}</Text>
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

export default DeleteModal;

// Styles
const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
  },
});
