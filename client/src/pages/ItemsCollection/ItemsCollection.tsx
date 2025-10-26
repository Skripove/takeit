import { useState, useContext, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Appbar, Text, TextInput, useTheme } from "react-native-paper";
import { darkTheme, lightTheme } from "../../theme/colors";
import MainScreen from "../MainScreen";
import {
  AddItemModal,
  DeleteItemModal,
  FloatingButton,
  Item,
} from "../../components";
import { ItemsContext } from "../../provider";
import { ItemID, ItemType } from "../../types/item";
import { FABPosition } from "../../components/Buttons/FloatingButton";

const titles = {
  storage: "Storage",
  editMode: "Storage (edit mode)",
};

export default function ItemsCollection() {
  const theme = useTheme();
  const { getAllItems, seeAllItems, addItem, removeItems, clearItems } =
    useContext(ItemsContext);

  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<ItemID>>(new Set());

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

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

  const handleShowDeleteItemModal = () => {
    setShowDeleteItemModal(true);
  };

  const hideAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const hideDeleteItemModal = () => {
    setShowDeleteItemModal(false);
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

  const onLongPressItem = useCallback(() => {
    setIsEditMode(true);
  }, []);

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title={isEditMode ? titles.editMode : titles.storage} />
        {isEditMode && (
          <Appbar.Action
            icon="dots-vertical"
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
            // onPress={showModal}
            icon="plus"
            label="Add to event..."
            disabled={!Boolean(selectedIds.size)}
          />
          <FloatingButton
            onPress={handleShowDeleteItemModal}
            icon="delete"
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
      <AddItemModal
        visible={showAddItemModal}
        onDismiss={hideAddItemModal}
        onSubmit={onAddItem}
      />
      <DeleteItemModal
        visible={showDeleteItemModal}
        onDismiss={hideDeleteItemModal}
        onSubmit={onDeleteItems}
      />
    </MainScreen>
  );
}

// Styles
const styles = StyleSheet.create({});
