import { View, FlatList } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import MainScreen from "../MainScreen";
import { useCallback, useContext, useState } from "react";
import { AddModal, DeleteModal, Event, FloatingButton } from "../../components";
import { EventsContext } from "../../provider";
import { EventID } from "../../types/event";
import { FABPosition } from "../../components/Buttons/FloatingButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FAB_HEIGHT = 56;
const GAP = 16;

export default function EventsCollection() {
  const theme = useTheme();
  const { events, addEvent, deleteEvents } = useContext(EventsContext);

  const [selectedIds, setSelectedIds] = useState<Set<EventID>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const bottomSpacer = insets.bottom + tabBar + FAB_HEIGHT + GAP;

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
    clearSelection();
  };

  const onCloseEditEvents = useCallback(() => {
    setIsEditMode(false);
    clearSelection();
  }, []);

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Events" />
      </Appbar.Header>

      <FlatList
        data={events}
        keyExtractor={(event) => String(event.id)}
        renderItem={({ item: event }) => (
          <View>
            <Event
              event={event}
              onPressWithCheckbox={toggleSelect}
              onLongPress={onEditEvents}
              withCheckBox={isEditMode}
              selected={selectedIds.has(event.id)}
            />
          </View>
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
