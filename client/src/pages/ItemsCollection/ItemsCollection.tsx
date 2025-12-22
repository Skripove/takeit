import {
  memo,
  useState,
  useContext,
  useCallback,
  useTransition,
  useRef,
} from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const titles = {
  items: "Items",
  itemsEditMode: "Items (edit mode)",
};

type ItemRowProps = {
  item: ItemType;
  selected: boolean;
  onToggle: (itemId: ItemID) => void;
  onLongPress: (itemId: ItemID) => void;
  withCheckBox: boolean;
};

const ItemRow = memo(
  ({ item, selected, onToggle, onLongPress, withCheckBox }: ItemRowProps) => {
    const handlePress = useCallback(() => {
      if (!withCheckBox) return;
      onToggle(item.id);
    }, [item.id, onToggle, withCheckBox]);

    const handleLongPress = useCallback(() => {
      onLongPress(item.id);
    }, [item.id, onLongPress]);

    return (
      <View>
        <Item
          item={item}
          onPress={handlePress}
          onLongPress={handleLongPress}
          withCheckBox={withCheckBox}
          selected={selected}
        />
      </View>
    );
  },
  (prev, next) =>
    prev.selected === next.selected &&
    prev.withCheckBox === next.withCheckBox &&
    prev.onToggle === next.onToggle &&
    prev.onLongPress === next.onLongPress &&
    prev.item.id === next.item.id &&
    prev.item.text === next.item.text &&
    prev.item.creationDate === next.item.creationDate
);
ItemRow.displayName = "ItemRow";

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
  const [isPending, startTransition] = useTransition();
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

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
    startTransition(() => setIsEditMode(true));
  }, [startTransition]);

  const onCloseEditItems = useCallback(() => {
    setIsEditMode(false);
    clearSelection();
  }, [clearSelection]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allSelected = items.length > 0 && prev.size === items.length;
      if (allSelected) return new Set();
      return new Set(items.map((item) => item.id));
    });
  }, [items]);

  const renderItem = useCallback(
    ({ item }: { item: ItemType }) => (
      <ItemRow
        item={item}
        selected={selectedIdsRef.current.has(item.id)}
        onToggle={toggleSelect}
        onLongPress={onEditItems}
        withCheckBox={isEditMode}
      />
    ),
    [isEditMode, onEditItems, toggleSelect]
  );

  return (
    <MainScreen>
      <Appbar.Header
        mode="center-aligned"
        style={{
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        }}
      >
        {isEditMode && (
          <TouchableOpacity onPress={toggleSelectAll}>
            <Appbar.Action
              icon={
                items.length > 0 && selectedIds.size === items.length
                  ? "checkbox-marked"
                  : "checkbox-blank-outline"
              }
              disabled={!items.length}
              animated={false}
            />
          </TouchableOpacity>
        )}
        <Appbar.Content
          title={isEditMode ? titles.itemsEditMode : titles.items}
          titleStyle={{ fontSize: 16 }}
        />
      </Appbar.Header>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
        ListFooterComponent={<View style={{ height: bottomSpacer }} />}
        initialNumToRender={items.length > 15 ? 15 : items.length}
        maxToRenderPerBatch={8}
        windowSize={5}
        updateCellsBatchingPeriod={16}
        removeClippedSubviews
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
