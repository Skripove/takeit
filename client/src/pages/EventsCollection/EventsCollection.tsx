import { View, FlatList, StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import MainScreen from "../MainScreen";
import { useCallback, useContext, useMemo, useState } from "react";
import { AddModal, DeleteModal, Event, FloatingButton } from "../../components";
import { EventsContext, ItemsContext } from "../../provider";
import { EventID, EventType } from "../../types/event";
import { ItemType } from "../../types/item";
import { FABPosition } from "../../components/Buttons/FloatingButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EventsStackParamList } from "../../types/navigation";

const titles = {
  events: "Events",
  eventsEditMode: "Events (edit mode)",
};

type Props = NativeStackScreenProps<EventsStackParamList, "EventsCollection">;

export default function EventsCollection({ navigation }: Props) {
  const theme = useTheme();
  const { events, addEvent, deleteEvents } = useContext(EventsContext);
  const { items } = useContext(ItemsContext);

  const [selectedIds, setSelectedIds] = useState<Set<EventID>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const bottomSpacer = insets.bottom + tabBar + 72;
  const numColumns = 2;

  const toggleSelect = useCallback((eventId: EventID) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(eventId) ? newSet.delete(eventId) : newSet.add(eventId);
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const onEditEvents = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleShowAddEventModal = () => {
    setShowAddEventModal(true);
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const hideAddEventModal = () => {
    setShowAddEventModal(false);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const onAddEvent = async (title: string) => {
    await addEvent(title);
  };

  const onDeleteEvents = async () => {
    const selestedEventIds = Array.from(selectedIds);
    await deleteEvents(selestedEventIds);
    onCloseEditEvents();
  };

  const onCloseEditEvents = useCallback(() => {
    setIsEditMode(false);
    clearSelection();
  }, [clearSelection]);

  const handleOpenEvent = useCallback(
    (eventId: EventID) => {
      if (isEditMode) return;
      navigation.navigate("Event", { eventId });
    },
    [navigation, isEditMode]
  );

  const itemsById = useMemo(() => {
    const map = new Map(items.map((item) => [item.id, item]));
    return map;
  }, [items]);

  const getItemsForEvent = useCallback(
    (event: EventType) => {
      return event.items
        .map((itemId) => itemsById.get(itemId))
        .filter((item): item is ItemType => Boolean(item));
    },
    [itemsById]
  );

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content
          title={isEditMode ? titles.eventsEditMode : titles.events}
        />
      </Appbar.Header>

      <FlatList
        key={`columns-${numColumns}`}
        data={events}
        keyExtractor={(event) => String(event.id)}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        renderItem={({ item: event }) => (
          <Event
            event={event}
            items={getItemsForEvent(event)}
            onPressWithCheckbox={toggleSelect}
            onLongPress={onEditEvents}
            withCheckBox={isEditMode}
            selected={selectedIds.has(event.id)}
            onPress={handleOpenEvent}
            style={styles.eventCard}
          />
        )}
        ListFooterComponent={<View style={{ height: bottomSpacer }} />}
        contentContainerStyle={{ padding: 12 }}
      />

      {isEditMode ? (
        <View>
          <FloatingButton
            onPress={handleShowDeleteModal}
            icon="delete-outline"
            disabled={!Boolean(selectedIds.size)}
            position={FABPosition.fabBottomRightSecond}
            style={{ backgroundColor: theme.colors.errorContainer }}
            color={theme.colors.onErrorContainer}
          />
          <FloatingButton
            onPress={onCloseEditEvents}
            icon="close"
            position={FABPosition.fabBottomRight}
          />
        </View>
      ) : (
        <View>
          <FloatingButton
            onPress={handleShowAddEventModal}
            icon="plus"
            label="Create new Event"
            disabled={isEditMode}
          />
          <FloatingButton
            onPress={onEditEvents}
            icon="clipboard-edit-outline"
            position={FABPosition.fabBottomRight}
            disabled={!events.length}
          />
        </View>
      )}

      <AddModal
        title="Add Event:"
        visible={showAddEventModal}
        onDismiss={hideAddEventModal}
        onSubmit={onAddEvent}
      />
      <DeleteModal
        title="Are you sure you want to delete selected Events?"
        visible={showDeleteModal}
        onDismiss={hideDeleteModal}
        onSubmit={onDeleteEvents}
      />
    </MainScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  eventCard: {
    flex: 0.49,
    aspectRatio: 1,
  },
});
