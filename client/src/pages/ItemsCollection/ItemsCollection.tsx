import { useState } from "react";
import { View, ScrollView, Alert, FlatList } from "react-native";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";

import { darkTheme, lightTheme } from "../../theme/colors";
import MainScreen from "../MainScreen";
import { Item } from "../../components";

const items = [
  {
    id: 1,
    text: "ApplesAppl esApplesApplesApplesApp lesApplesApplesA pplesApplesApplesApples ApplesApplesApplesApplesApples ApplesAppl esApplesApplesApplesApp lesApplesApplesA pplesApplesApplesApples ApplesApplesApplesApplesApples",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 2,
    text: "Apples",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 3,
    text: "Bread",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 4,
    text: "Orange",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 5,
    text: "Afffaddadasd",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 6,
    text: "Bbbbbbbbbbb",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 7,
    text: "Cccccccccccccc",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 8,
    text: "Dddddddddddd",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 9,
    text: "Eeeeeeeeee",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 10,
    text: "Ffs",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 11,
    text: "gggggggggg",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 12,
    text: "H",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 13,
    text: "Iiiiii--i",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 14,
    text: "Jj",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
  {
    id: 15,
    text: "Kkkkkkkkkkkk",
    creationDate: "2025-09-04T16:20:16.607Z",
    checked: false,
  },
];

export default function ItemsCollection() {
  const theme = useTheme();
  const [name, setName] = useState("");

  const onPressHandler = (itemText: string) => {
    console.log(`${itemText} click`);
  };

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Storage" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
      <TextInput
        label="Ваше имя"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 16 }}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <Item item={item} onPress={onPressHandler} key={item.id} />
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
      />
    </MainScreen>
  );
}
