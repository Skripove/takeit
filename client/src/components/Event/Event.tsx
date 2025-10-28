import { View } from "react-native";
import { Card, Text, useTheme, Checkbox } from "react-native-paper";
import { EventID, EventType } from "../../types/event";
import { memo } from "react";

type Props = {
  event: EventType;
  onPressWithCheckbox: (eventId: EventID) => void;
  onLongPress?: (eventId: EventID) => void;
  withCheckBox?: boolean;
  selected?: boolean;
};

function Event({
  event,
  onPressWithCheckbox,
  onLongPress,
  withCheckBox,
  selected,
}: Props) {
  const theme = useTheme();

  const onPressHandler = () => {
    if (!withCheckBox) return;
    onPressWithCheckbox(event.id);
  };

  const onLongPressHandler = () => {
    onLongPress?.(event.id);
  };

  return (
    <Card
      style={{
        marginVertical: 4,
        elevation: 0,
        shadowColor: "transparent",
        height: 92,
        justifyContent: "center",
      }}
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {withCheckBox && (
            <View
              style={{
                margin: -9,
              }}
            >
              <Checkbox status={selected ? "checked" : "unchecked"} />
            </View>
          )}
          <Text
            style={{ fontSize: 18, marginLeft: 12, flex: 1, flexShrink: 1 }}
          >
            {event.title}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const areEqual = (prev: Props, next: Props) => {
  if (prev.selected !== next.selected) return false;
  if (prev.withCheckBox !== next.withCheckBox) return false;
  if (prev.event.title !== next.event.title) return false;
  return true;
};

export default memo(Event, areEqual);
