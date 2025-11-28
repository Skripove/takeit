import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Appbar, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Item } from "../../components";
import { EventsContext, ItemsContext } from "../../provider";
import { ItemID, ItemType } from "../../types/item";
import { EventsStackParamList } from "../../types/navigation";
import MainScreen from "../MainScreen";
import { EventType } from "../../types/event";

type Props = NativeStackScreenProps<EventsStackParamList, "Event">;

export default function EventScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { eventId } = route.params;
  const { getEvents, checkItems, uncheckItems } = useContext(EventsContext);
  const { getItems } = useContext(ItemsContext);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const bottomSpacer = insets.bottom + tabBar + 72;

  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const [event, setEvent] = useState<EventType>();
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<ItemID>>(
    new Set()
  );

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const [currentEvent] = await getEvents([eventId]);
      if (!currentEvent) {
        setMissing(true);
        setSelectedItemIds(new Set());
        return;
      }

      setMissing(false);
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
      setItems(storageItems);
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

  const toggleItemChecked = useCallback(
    async (itemId: ItemID) => {
      if (!event) return;

      const currentlySelected = selectedItemIds.has(itemId);
      setSelectedItemIds((prev) => {
        const next = new Set(prev);
        if (currentlySelected) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });

      try {
        if (currentlySelected) {
          await uncheckItems([itemId], event.id);
        } else {
          await checkItems([itemId], event.id);
        }

        setEvent((prev) => {
          if (!prev) return prev;
          const updatedItems = prev.items.map((eventItem) =>
            eventItem.itemId === itemId
              ? { ...eventItem, checked: !currentlySelected }
              : eventItem
          );
          return { ...prev, items: updatedItems };
        });
      } catch (error) {
        console.error(error);
      }
    },
    [checkItems, event, selectedItemIds, uncheckItems]
  );

  const creationDate = event?.creationDate
    ? new Date(event?.creationDate).toLocaleString()
    : null;

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
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={event?.title || "Event"} />
      </Appbar.Header>

      <View
        style={
          {
            // padding: 16,
            // gap: 16,
          }
        }
      >
        {loading ? (
          <ActivityIndicator style={{ marginTop: 32 }} />
        ) : missing ? (
          <Text variant="bodyLarge">Event not found.</Text>
        ) : items.length === 0 ? (
          <Text variant="bodyLarge">No items attached yet.</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Item
                item={item}
                onPress={toggleItemChecked}
                withCheckBox={true}
                selected={selectedItemIds.has(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12 }}
            ListFooterComponent={<View style={{ height: bottomSpacer }} />}
            initialNumToRender={items.length > 15 ? 15 : items.length}
          />
        )}
      </View>
    </MainScreen>
  );
}
