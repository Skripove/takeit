import { useState, useContext, useEffect, useCallback } from "react";
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
import { ItemID, ItemType } from "../../types/item";
import { EventID } from "../../types/event";
import { FABPosition } from "../../components/Buttons/FloatingButton";

const titles = {
  storage: "Storage",
  editMode: "Storage (edit mode)",
};

export default function ItemsCollection() {
  const theme = useTheme();
  const { getAllItems, seeAllItems, addItem, removeItems, clearItems } =
    useContext(ItemsContext);
  const { attachItems } = useContext(EventsContext);

  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<ItemID>>(new Set());

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddItemsToEventsModal, setShowAddItemsToEventsModal] =
    useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Items in ItemsCollection...");
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAllItems]);

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

  const onAddItem = async (title: string) => {
    const newItem = await addItem(title);
    setItems((prev) => [...prev, newItem]);
  };

  const onDeleteItems = async () => {
    const selestedItemIds = Array.from(selectedIds);
    await removeItems(selestedItemIds);
    setItems((prev) =>
      prev.filter((prevItem) => !selestedItemIds.includes(prevItem.id))
    );
    clearSelection();
  };

  const onAddItemsToEvents = async (selecyedEventIds: EventID[]) => {
    const selestedItemIds = Array.from(selectedIds);
    await attachItems(selestedItemIds, selecyedEventIds);
  };

  const onLongPressItem = useCallback(() => {
    setIsEditMode(true);
  }, []);

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title={isEditMode ? titles.editMode : titles.storage} />
        {isEditMode && (
          <Appbar.Action
            icon="close"
            onPress={() => {
              setIsEditMode(false);
              clearSelection();
            }}
          />
        )}
      </Appbar.Header>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <Item
              item={item}
              onPress={toggleSelect}
              onLongPress={onLongPressItem}
              withCheckBox={isEditMode}
              selected={selectedIds.has(item.id)}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
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
            position={FABPosition.fabBottomRight}
            style={{ backgroundColor: theme.colors.errorContainer }}
            color={theme.colors.onErrorContainer}
          />
        </View>
      ) : (
        <FloatingButton
          onPress={handleShowAddItemModal}
          icon="plus"
          disabled={isEditMode}
        />
      )}

      <AddModal
        title="Add Item:"
        visible={showAddItemModal}
        onDismiss={hideAddItemModal}
        onSubmit={onAddItem}
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
