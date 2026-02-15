import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text, useTheme, Checkbox } from "react-native-paper";
import { EventID, EventType } from "@/types/event";
import { memo, useMemo } from "react";
import { ItemType } from "@/types/item";
import { sortElements } from "@/utils/sortElements";

type Props = {
  event: EventType;
  items?: ItemType[];
  onPressWithCheckbox: (eventId: EventID) => void;
  onLongPress?: (eventId: EventID) => void;
  onPress?: (eventId: EventID) => void;
  withCheckBox?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

function Event({
  event,
  items,
  onPressWithCheckbox,
  onLongPress,
  onPress,
  withCheckBox,
  selected,
  style,
}: Props) {
  const theme = useTheme();
  const ITEM_ROW_HEIGHT = 22;
  const MAX_VISIBLE_ITEMS = 6;
  const itemsListHeight = ITEM_ROW_HEIGHT * MAX_VISIBLE_ITEMS;
  const sortedItems = useMemo(
    () => (items ? sortElements(items, "text", "asc") : []),
    [items]
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          marginVertical: 4,
          elevation: 0,
          shadowColor: "transparent",
          justifyContent: "center",
          overflow: "hidden",
        },
        content: {
          aspectRatio: 1,
          gap: 4,
        },
        checkboxWrapper: {
          position: "absolute",
          right: 0,
          bottom: 0,
        },
        itemsScroll: {
          height: itemsListHeight,
        },
        itemRow: {
          flexDirection: "row",
          alignItems: "center",
          minHeight: ITEM_ROW_HEIGHT,
        },
        itemRowStatic: {
          flexDirection: "row",
          alignItems: "center",
        },
        itemBullet: {
          width: 6,
          height: 6,
          borderWidth: 1,
          borderRadius: 4,
          marginRight: 4,
          opacity: 0.5,
        },
        itemBulletChecked: {
          backgroundColor: theme.colors.onBackground,
        },
      }),
    [theme, itemsListHeight, ITEM_ROW_HEIGHT]
  );

  const onPressHandler = () => {
    if (withCheckBox) {
      onPressWithCheckbox(event.id);
      return;
    }
    onPress?.(event.id);
  };

  const onLongPressHandler = () => {
    onLongPress?.(event.id);
  };

  const renderItemRow = (item: ItemType, rowStyle: ViewStyle) => {
    const isChecked = event.items.find(
      (evItem) => evItem.itemId === item.id
    )?.checked;
    return (
      <View key={item.id} style={rowStyle}>
        <View
          style={[
            styles.itemBullet,
            isChecked && styles.itemBulletChecked,
          ]}
        />
        <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="tail">
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <Card
      mode={"outlined"}
      style={[styles.card, style]}
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
    >
      <Card.Content>
        <View style={styles.content}>
          {withCheckBox && (
            <View style={styles.checkboxWrapper}>
              <Checkbox.Android status={selected ? "checked" : "unchecked"} />
            </View>
          )}
          <Text variant="titleMedium" numberOfLines={2} ellipsizeMode="tail">
            {event.title}
          </Text>
          {sortedItems.length > MAX_VISIBLE_ITEMS ? (
            <ScrollView
              style={styles.itemsScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={Platform.OS === "android"}
            >
              {sortedItems.map((item) => renderItemRow(item, styles.itemRow))}
            </ScrollView>
          ) : (
            <View>
              {sortedItems.map((item) =>
                renderItemRow(item, styles.itemRowStatic)
              )}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

export default memo(Event);
