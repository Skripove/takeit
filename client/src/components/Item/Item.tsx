import { useState } from "react";
import { View } from "react-native";
import { Card, Text, useTheme, Checkbox } from "react-native-paper";
import { ItemType } from "../../types/item";

type Props = {
  item: ItemType;
  onPress: (itemText: string) => void;
};

export default function Item({ item, onPress }: Props) {
  const theme = useTheme();
  const [status, setStatus] = useState<"checked" | "unchecked">(
    item.checked ? "checked" : "unchecked"
  );

  const onPressHandler = () => {
    setStatus((prev) => (prev === "checked" ? "unchecked" : "checked"));
    onPress(item.text);
  };

  return (
    <Card
      style={{ marginVertical: 4, elevation: 0, shadowColor: "transparent" }}
      onPress={onPressHandler}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox status={status} />
          <Text style={{ marginLeft: 12, flex: 1, flexShrink: 1 }}>
            {item.text}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
