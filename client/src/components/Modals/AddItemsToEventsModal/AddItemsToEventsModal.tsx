import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  useTheme,
  Portal,
  Modal,
  Text,
  IconButton,
  Button,
  Chip,
} from "react-native-paper";
import { EventID, EventType } from "../../../types/event";
import { EventsContext } from "../../../provider";

export type AddItemsToEventsModalProps = Omit<
  React.ComponentProps<typeof Modal>,
  "children"
> & {
  onSubmit: (eventIds: EventID[]) => Promise<void>;
};

const AddItemsToEventsModal: React.FC<AddItemsToEventsModalProps> = ({
  onSubmit,
  onDismiss,
  ...props
}) => {
  const theme = useTheme();

  const { getAllEvents, addEvent, removeEvent, clearEvents } =
    useContext(EventsContext);

  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<EventID>>(
    new Set()
  );

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Events in AddItemsToEventsModal...");
        // const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; //TODO REMOVE
        // for (const a of arr) {
        //   await addEvent(`Event - ${a}`);
        // }
        // await clearEvents();
        const allEvents = await getAllEvents(); //TODO REMOVE move Items and Event preload into providers
        setEvents(allEvents);
        // console.log(events); //TODO REMOVE
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAllEvents]);

  const toggle = (eventID: EventID) => {
    setSelectedEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(eventID) ? newSet.delete(eventID) : newSet.add(eventID);
      return newSet;
    });
  };

  const submitHandler = async () => {
    if (!selectedEventIds.size) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(Array.from(selectedEventIds));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (loading) return;
    onDismiss?.();
    setSelectedEventIds(new Set());
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
          <Text variant="titleLarge">Select the Events:</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            <View style={{ gap: 24, alignItems: "center" }}>
              {events.map((event) => {
                const selected = selectedEventIds.has(event.id);
                return (
                  <Chip
                    key={event.id}
                    onPress={() => toggle(event.id)}
                    mode="outlined"
                    icon={selected ? "plus" : undefined}
                  >
                    {event.title}
                  </Chip>
                );
              })}
            </View>
          </ScrollView>
          <Button
            mode="contained"
            loading={loading}
            disabled={!selectedEventIds.size || loading}
            onPress={submitHandler}
            contentStyle={{ height: 56 }}
          >
            Add Items into Events
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default AddItemsToEventsModal;

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
});
