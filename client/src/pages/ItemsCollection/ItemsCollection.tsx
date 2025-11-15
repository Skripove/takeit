import { useState, useContext, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { darkTheme, lightTheme } from "../../theme/colors";
import MainScreen from "../MainScreen";
import {
  AddModal,
  AddItemsToEventsModal,
  DeleteModal,
  FloatingButton,
  Item,
} from "../../components";
import { EventsContext, ItemsContext } from "../../provider";
import { ItemID } from "../../types/item";
import { EventID } from "../../types/event";
import { FABPosition } from "../../components/Buttons/FloatingButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const titles = {
  items: "Items",
  itemsEditMode: "Items (edit mode)",
};

export default function ItemsCollection() {
  const theme = useTheme();
  const { items, addItems, deleteItems } = useContext(ItemsContext);
  const { attachItems, loadEvents } = useContext(EventsContext);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const bottomSpacer = insets.bottom + tabBar + 72;

  const [selectedIds, setSelectedIds] = useState<Set<ItemID>>(new Set());

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddItemsToEventsModal, setShowAddItemsToEventsModal] =
    useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const toggleSelect = useCallback((itemId: ItemID) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleShowAddItemModal = () => {
    setShowAddItemModal(true);
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleShowAddItemsToEventsModal = () => {
    setShowAddItemsToEventsModal(true);
  };

  const hideAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const hideShowAddItemsToEventsModal = () => {
    setShowAddItemsToEventsModal(false);
  };

  const onAddItems = async (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((string) => string.trim())
      .filter((string) => string.length > 0);

    if (lines.length === 0) return;

    await addItems(lines);
  };

  const onDeleteItems = async () => {
    const selestedItemIds = Array.from(selectedIds);
    await deleteItems(selestedItemIds);
    await loadEvents();
    if (selestedItemIds.length === items.length) {
      setIsEditMode(false);
    }
    onCloseEditItems();
  };

  const onAddItemsToEvents = async (selectedEventIds: EventID[]) => {
    const selestedItemIds = Array.from(selectedIds);
    await attachItems(selestedItemIds, selectedEventIds);
    onCloseEditItems();
  };

  const onEditItems = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const onCloseEditItems = useCallback(() => {
    setIsEditMode(false);
    clearSelection();
  }, [clearSelection]);

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content
          title={isEditMode ? titles.itemsEditMode : titles.items}
        />
      </Appbar.Header>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <Item
              item={item}
              onPress={toggleSelect}
              onLongPress={onEditItems}
              withCheckBox={isEditMode}
              selected={selectedIds.has(item.id)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
        ListFooterComponent={<View style={{ height: bottomSpacer }} />}
      />

      {isEditMode ? (
        <View>
          <FloatingButton
            onPress={handleShowAddItemsToEventsModal}
            icon="plus"
            label="Add to Event..."
            disabled={!Boolean(selectedIds.size)}
          />
          <FloatingButton
            onPress={handleShowDeleteModal}
            icon="delete-outline"
            disabled={!Boolean(selectedIds.size)}
            position={FABPosition.fabBottomRightSecond}
            style={{ backgroundColor: theme.colors.errorContainer }}
            color={theme.colors.onErrorContainer}
          />
          <FloatingButton
            onPress={onCloseEditItems}
            icon="close"
            position={FABPosition.fabBottomRight}
          />
        </View>
      ) : (
        <View>
          <FloatingButton
            onPress={handleShowAddItemModal}
            icon="plus"
            disabled={isEditMode}
          />
          <FloatingButton
            onPress={onEditItems}
            icon="clipboard-edit-outline"
            position={FABPosition.fabBottomRight}
            disabled={!items.length}
          />
        </View>
      )}

      <AddModal
        title="Add Items:"
        visible={showAddItemModal}
        onDismiss={hideAddItemModal}
        onSubmit={onAddItems}
        multiline
      />
      <DeleteModal
        title="Are you sure you want to delete selected Items?"
        visible={showDeleteModal}
        onDismiss={hideDeleteModal}
        onSubmit={onDeleteItems}
      />
      <AddItemsToEventsModal
        visible={showAddItemsToEventsModal}
        onDismiss={hideShowAddItemsToEventsModal}
        onSubmit={onAddItemsToEvents}
      />
    </MainScreen>
  );
}

// Styles
const styles = StyleSheet.create({});
