import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  memo,
  useCallback,
  useContext,
  useRef,
  useState,
  useTransition,
  useMemo,
} from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Swipeable } from "react-native-gesture-handler";
import { Item } from "@/components";
import { EventsContext, ItemsContext } from "@/provider";
import { ItemID, ItemType } from "@/types/item";
import { EventsStackParamList } from "@/types/navigation";
import MainScreen from "@/pages/MainScreen";
import { EventType } from "@/types/event";
import { sortElements } from "@/utils/sortElements";

type Props = NativeStackScreenProps<EventsStackParamList, "Event">;

type ItemRowProps = {
  item: ItemType;
  selected: boolean;
  renderRightActions: (itemId: ItemID) => React.ReactNode;
  onToggle: (itemId: ItemID, selected: boolean) => void;
};

const EventItemRow = memo(
  ({ item, selected, renderRightActions, onToggle }: ItemRowProps) => {
    const handlePress = useCallback(() => {
      onToggle(item.id, selected);
    }, [item.id, onToggle, selected]);

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
        friction={2}
      >
        <Item
          item={item}
          onPress={handlePress}
          withCheckBox
          selected={selected}
          lineThrough={selected}
        />
      </Swipeable>
    );
  },
  (prev, next) =>
    prev.selected === next.selected &&
    prev.onToggle === next.onToggle &&
    prev.renderRightActions === next.renderRightActions &&
    prev.item.id === next.item.id &&
    prev.item.text === next.item.text &&
    prev.item.creationDate === next.item.creationDate
);
EventItemRow.displayName = "EventItemRow";

export default function EventScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { eventId } = route.params;
  const { getEvents, checkItems, uncheckItems, detachItems } =
    useContext(EventsContext);
  const { getItems } = useContext(ItemsContext);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const bottomSpacer = insets.bottom + tabBar + 72;
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
        rightActionContainer: {
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 4,
        },
        loadingIndicator: {
          marginTop: 32,
        },
        listContent: {
          padding: 12,
        },
        listFooter: {
          height: bottomSpacer,
        },
      }),
    [theme, bottomSpacer]
  );

  const [loading, setLoading] = useState(true);

  const [event, setEvent] = useState<EventType>();
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<ItemID>>(
    new Set()
  );
  const [isPending, startTransition] = useTransition();
  const selectedItemIdsRef = useRef(selectedItemIds);
  selectedItemIdsRef.current = selectedItemIds;

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const [currentEvent] = await getEvents([eventId]);
      if (!currentEvent) {
        setSelectedItemIds(new Set());
        return;
      }

      setEvent(currentEvent);
      setSelectedItemIds(
        new Set(
          currentEvent.items
            .filter((eventItem) => eventItem.checked)
            .map((eventItem) => eventItem.itemId)
        )
      );

      if (!currentEvent.items.length) {
        setItems([]);
        return;
      }

      const storageItems = await getItems(
        currentEvent.items.map((eventItem) => eventItem.itemId)
      );
      setItems(sortElements(storageItems, "text", "asc"));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [eventId, getEvents, getItems]);

  useFocusEffect(
    useCallback(() => {
      loadEvent();
    }, [loadEvent])
  );

  // Refresh storage - START
  const prevSelectedRef = useRef<Set<ItemID>>(new Set());
  React.useEffect(() => {
    const prev = prevSelectedRef.current;
    const curr = selectedItemIds;

    const toCheck: ItemID[] = [];
    const toUncheck: ItemID[] = [];

    // diff
    for (const id of curr) if (!prev.has(id)) toCheck.push(id);
    for (const id of prev) if (!curr.has(id)) toUncheck.push(id);

    if (!toCheck.length && !toUncheck.length) return;

    const timer = setTimeout(async () => {
      try {
        if (toCheck.length) await checkItems(toCheck, eventId);
        if (toUncheck.length) await uncheckItems(toUncheck, eventId);
      } catch (e) {
        console.error(e);
      }
    }, 30);

    prevSelectedRef.current = new Set(curr);
    return () => clearTimeout(timer); //clear existed timer if useEffect worked again
  }, [selectedItemIds, checkItems, uncheckItems, eventId]);
  // Refresh storage - END

  const toggleItemChecked = useCallback(
    async (itemId: ItemID, currentlySelected: boolean) => {
      startTransition(() => {
        setSelectedItemIds((prev) => {
          const next = new Set(prev);
          if (currentlySelected) {
            next.delete(itemId);
          } else {
            next.add(itemId);
          }
          return next;
        });

        setEvent((prev) => {
          if (!prev) return prev;
          const itemIndex = prev.items.findIndex(
            (eventItem) => eventItem.itemId === itemId
          );
          if (itemIndex === -1) return prev;
          const existing = prev.items[itemIndex];
          if (existing.checked === !currentlySelected) return prev;
          const updatedItems = [...prev.items];
          updatedItems[itemIndex] = {
            ...existing,
            checked: !currentlySelected,
          };
          return { ...prev, items: updatedItems };
        });
      });
    },
    []
  );

  const deleteItemFromIvent = useCallback(
    async (itemId: ItemID) => {
      startTransition(() => {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        setSelectedItemIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        setEvent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter(
              (eventItem) => eventItem.itemId !== itemId
            ),
          };
        });
      });

      try {
        await detachItems([itemId], eventId);
      } catch (error) {
        console.error(error);
      }
    },
    [detachItems, eventId, startTransition]
  );

  const renderRightActions = useCallback(
    (itemId: ItemID) => (
      <View style={styles.rightActionContainer}>
        <IconButton
          icon="delete-outline"
          onPress={() => deleteItemFromIvent(itemId)}
          iconColor={theme.colors.error}
          accessibilityLabel="delete-item"
        />
      </View>
    ),
    [deleteItemFromIvent, theme.colors.error, styles]
  );

  const renderItem = useCallback(
    ({ item }: { item: ItemType }) => (
      <EventItemRow
        item={item}
        selected={selectedItemIdsRef.current.has(item.id)}
        renderRightActions={renderRightActions}
        onToggle={toggleItemChecked}
      />
    ),
    [renderRightActions, toggleItemChecked]
  );

  return (
    <MainScreen>
      <Appbar.Header
        mode="center-aligned"
        style={styles.appbarHeader}
      >
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content
          title={event?.title || "Event"}
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <View>
        {loading ? (
          <ActivityIndicator style={styles.loadingIndicator} />
        ) : items.length === 0 ? (
          <Text variant="bodyLarge">No items attached yet.</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<View style={styles.listFooter} />}
            initialNumToRender={items.length > 15 ? 15 : items.length}
            maxToRenderPerBatch={8}
            windowSize={5}
            updateCellsBatchingPeriod={16}
            removeClippedSubviews
            extraData={selectedItemIds}
          />
        )}
      </View>
    </MainScreen>
  );
}
