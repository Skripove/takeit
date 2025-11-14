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

type Props = NativeStackScreenProps<EventsStackParamList, "Event">;

const noop: (itemId: ItemID) => void = () => {};

export default function EventScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { eventId } = route.params;
  const { getEvents } = useContext(EventsContext);
  const { getItems } = useContext(ItemsContext);

  const insets = useSafeAreaInsets();
  const tabBar = useBottomTabBarHeight?.() ?? 0;
  const bottomSpacer = insets.bottom + tabBar + 72;

  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventCreatedAt, setEventCreatedAt] = useState<string | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [missing, setMissing] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const [currentEvent] = await getEvents([eventId]);
      if (!currentEvent) {
        setMissing(true);
        setItems([]);
        setEventTitle("");
        setEventCreatedAt(null);
        return;
      }

      setMissing(false);
      setEventTitle(currentEvent.title);
      setEventCreatedAt(currentEvent.creationDate);

      if (!currentEvent.items.length) {
        setItems([]);
        return;
      }

      const storageItems = await getItems(currentEvent.items);
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

  const creationDate = eventCreatedAt
    ? new Date(eventCreatedAt).toLocaleString()
    : null;

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={eventTitle || "Event"} />
      </Appbar.Header>

      <View
        style={{
          padding: 16,
          gap: 16,
        }}
      >
        {creationDate && (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Created: {creationDate}
          </Text>
        )}

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
            renderItem={({ item }) => <Item item={item} onPress={noop} />}
            ListFooterComponent={<View style={{ height: bottomSpacer }} />}
          />
        )}
      </View>
    </MainScreen>
  );
}
