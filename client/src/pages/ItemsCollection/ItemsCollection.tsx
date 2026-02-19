import {
  memo,
  useState,
  useContext,
  useCallback,
  useMemo,
  useTransition,
  useRef,
} from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { darkTheme, lightTheme } from "@/theme/colors";
import MainScreen from "@/pages/MainScreen";
import {
  AddItemsToEventsModal,
  DeleteModal,
  FloatingButton,
  Item,
  StickyTextInput,
} from "@/components";
import { EventsContext, ItemsContext } from "@/provider";
import { ItemID, ItemType } from "@/types/item";
import { EventID } from "@/types/event";
import { FABPosition } from "@/components/Buttons/FloatingButton";
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
    prev.item.creationDate === next.item.creationDate,
);
ItemRow.displayName = "ItemRow";

export default function ItemsCollection() {
  const theme = useTheme();
  const { items, addItems, deleteItems } = useContext(ItemsContext);
  const { attachItems, loadEvents } = useContext(EventsContext);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const composerBaseHeight = 72;
  const bottomSpacer = insets.bottom + tabBar + composerBaseHeight + 12;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        appbarHeader: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        },
        appbarTitle: {
          fontSize: 16,
        },
        listContent: {
          padding: 12,
        },
        listFooter: {
          height: bottomSpacer * 2,
        },
        fabAddToEvent: {
          bottom: composerBaseHeight,
        },
        deleteFab: {
          backgroundColor: theme.colors.errorContainer,
          bottom: composerBaseHeight,
        },
      }),
    [theme, bottomSpacer],
  );

  const [selectedIds, setSelectedIds] = useState<Set<ItemID>>(new Set());

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddItemsToEventsModal, setShowAddItemsToEventsModal] =
    useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

  const [text, setText] = useState("");
  const [filterText, setFilterText] = useState("");

  const filteredItems = useMemo(() => {
    const query = filterText.trim();
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter((item) => item.text.toLowerCase().includes(lower));
  }, [items, filterText]);

  const listData = isEditMode ? filteredItems : items;

  const toggleSelect = useCallback((itemId: ItemID) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleShowAddItemsToEventsModal = () => {
    setShowAddItemsToEventsModal(true);
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

  const submitText = async () => {
    if (!text.trim()) return;
    await onAddItems(text);
    setText("");
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
  }, [setIsEditMode]);

  const onCloseEditItems = useCallback(() => {
    setIsEditMode(false);
    setFilterText("");
    clearSelection();
  }, [clearSelection]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const list = isEditMode ? filteredItems : items;
      const allSelected = list.length > 0 && prev.size === list.length;
      if (allSelected) return new Set();
      return new Set(list.map((item) => item.id));
    });
  }, [items, isEditMode, filteredItems]);

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
    [isEditMode, onEditItems, toggleSelect],
  );

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned" style={styles.appbarHeader}>
        {isEditMode && (
          <TouchableOpacity onPress={toggleSelectAll}>
            <Appbar.Action
              icon={
                listData.length > 0 && selectedIds.size === listData.length
                  ? "checkbox-marked"
                  : "checkbox-blank-outline"
              }
              disabled={!listData.length}
              animated={false}
            />
          </TouchableOpacity>
        )}
        <Appbar.Content
          title={isEditMode ? titles.itemsEditMode : titles.items}
          titleStyle={styles.appbarTitle}
        />
        {isEditMode && (
          <Appbar.Action
            icon="close"
            onPress={onCloseEditItems}
            animated={false}
          />
        )}
      </Appbar.Header>

      <FlatList
        data={listData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={styles.listFooter} />}
        initialNumToRender={listData.length > 15 ? 15 : listData.length}
        maxToRenderPerBatch={8}
        windowSize={5}
        updateCellsBatchingPeriod={16}
        removeClippedSubviews
      />

      {!isEditMode ? (
        <StickyTextInput
          value={text}
          onChangeText={setText}
          onSubmit={submitText}
          placeholder="Add items..."
          keyboardOpenedOffset={tabBar - 6}
        />
      ) : (
        <StickyTextInput
          value={filterText}
          onChangeText={setFilterText}
          placeholder="Filter items..."
          keyboardOpenedOffset={tabBar - 6}
        />
      )}

      {isEditMode && (
        <View>
          {Boolean(selectedIds.size) && (
            <>
              <FloatingButton
                onPress={handleShowAddItemsToEventsModal}
                icon="plus"
                label="Add to Event..."
                style={styles.fabAddToEvent}
              />
              <FloatingButton
                onPress={handleShowDeleteModal}
                icon="delete-outline"
                position={FABPosition.fabBottomRight}
                style={[styles.deleteFab]}
                color={theme.colors.onErrorContainer}
              />
            </>
          )}
        </View>
      )}
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
