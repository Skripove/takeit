import { View, StyleProp, ViewStyle } from "react-native";
import { Card, Text, useTheme, Checkbox } from "react-native-paper";
import { EventID, EventType } from "../../types/event";
import { memo, useMemo } from "react";
import { ItemType } from "../../types/item";
import { sortElements } from "../../utils/sortElements";

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
      style={[
        {
          marginVertical: 4,
          elevation: 0,
          shadowColor: "transparent",
          justifyContent: "center",
          // backgroundColor: theme.colors.background,
          overflow: "hidden",
        },
        style,
      ]}
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
    >
      <Card.Content>
        <View
          style={{
            aspectRatio: 1,
            gap: 4,
          }}
        >
          {withCheckBox && (
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
              }}
            >
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
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderWidth: 1,
                      borderRadius: 4,
                      marginRight: 4,
                      backgroundColor: isChecked
                        ? theme.colors.onBackground
                        : undefined,
                      opacity: 0.5,
                    }}
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
