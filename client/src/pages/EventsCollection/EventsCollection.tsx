import { View, FlatList } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import MainScreen from "../MainScreen";

const events = [
  {
    id: 1,
    text: "Купить",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 2,
    text: "В поход",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 3,
    text: "Черногория",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
];

export default function EventsCollection() {
  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Events" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
    </MainScreen>
  );
}
