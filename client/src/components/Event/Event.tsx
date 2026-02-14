import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
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
        itemRow: {
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
    [theme]
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
          <View>
            {sortedItems.slice(0, 6).map((item) => {
              const isChecked = event.items.find(
                (evItem) => evItem.itemId === item.id
              )?.checked;
              return (
                <View
                  key={item.id}
                  style={styles.itemRow}
                >
                  <View
                    style={[
                      styles.itemBullet,
                      isChecked && styles.itemBulletChecked,
                    ]}
                  />
                  <Text
                    variant="bodyMedium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.text}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export default memo(Event);
