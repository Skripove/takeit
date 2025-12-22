import { TouchableOpacity, View } from "react-native";
import { Card, Text, useTheme, Checkbox } from "react-native-paper";
import { ItemID, ItemType } from "../../types/item";
import { memo, useMemo } from "react";

type Props = {
  item: ItemType;
  onPress: (itemId: ItemID) => void;
  onLongPress?: (itemId: ItemID) => void;
  withCheckBox?: boolean;
  selected?: boolean;
  lineThrough?: boolean;
};

function Item({
  item,
  onPress,
  onLongPress,
  withCheckBox,
  selected,
  lineThrough,
}: Props) {
  const theme = useTheme();

  const noAnimTheme = useMemo(
    () => ({ ...theme, animation: { ...theme.animation, scale: 0 } }),
    [theme]
  );

  const onPressHandler = () => {
    if (!withCheckBox) return;
    onPress(item.id);
  };

  const onLongPressHandler = () => {
    onLongPress?.(item.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
      // hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {withCheckBox && (
        <View style={{}} pointerEvents="none">
          <Checkbox.Android
            theme={noAnimTheme}
            status={selected ? "checked" : "unchecked"}
            uncheckedColor={theme.colors.outline}
          />
        </View>
      )}
      <Card
        mode={"outlined"}
        style={{
          marginVertical: 4,
          flex: 1,
          opacity: lineThrough ? 0.6 : 1,
        }}
      >
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                marginLeft: 12,
                flex: 1,
                flexShrink: 1,
                textDecorationLine: lineThrough ? "line-through" : "none",
              }}
            >
              {item.text}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const areEqual = (prev: Props, next: Props) => {
  if (prev.onPress !== next.onPress) return false;
  if (prev.onLongPress !== next.onLongPress) return false;
  if (prev.selected !== next.selected) return false;
  if (prev.withCheckBox !== next.withCheckBox) return false;
  if (prev.lineThrough !== next.lineThrough) return false;
  if (prev.item.id !== next.item.id) return false;
  if (prev.item.text !== next.item.text) return false;
  if (prev.item.creationDate !== next.item.creationDate) return false;
  return true;
};

export default memo(Item, areEqual);
