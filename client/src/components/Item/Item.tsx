import { TouchableOpacity, View } from "react-native";
import { Card, Text, useTheme, Checkbox } from "react-native-paper";
import { ItemID, ItemType } from "../../types/item";
import { memo } from "react";

type Props = {
  item: ItemType;
  onPress: (itemId: ItemID) => void;
  onLongPress?: (itemId: ItemID) => void;
  withCheckBox?: boolean;
  selected?: boolean;
};

function Item({ item, onPress, onLongPress, withCheckBox, selected }: Props) {
  const theme = useTheme();

  const onPressHandler = () => {
    if (!withCheckBox) return;
    onPress(item.id);
  };

  const onLongPressHandler = () => {
    onLongPress?.(item.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={1} // без затемнения
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {withCheckBox && (
        <View style={{}} pointerEvents="none">
          <Checkbox.Android
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
        }}
      >
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginLeft: 12, flex: 1, flexShrink: 1 }}>
              {item.text}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const areEqual = (prev: Props, next: Props) => {
  if (prev.selected !== next.selected) return false;
  if (prev.withCheckBox !== next.withCheckBox) return false;
  if (prev.item.text !== next.item.text) return false;
  return true;
};

export default memo(Item, areEqual);
