import { useState, useContext, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Appbar, Text, TextInput, useTheme } from "react-native-paper";
import { darkTheme, lightTheme } from "../../theme/colors";
import MainScreen from "../MainScreen";
import { AddItemModal, FloatingButton, Item } from "../../components";
import { ItemsContext } from "../../provider";
import { ItemType } from "../../types/item";

export default function ItemsCollection() {
  const theme = useTheme();
  const { getAllItems, seeAllItems, addItem, removeItem, clearItems } =
    useContext(ItemsContext);

  const [items, setItems] = useState<ItemType[]>([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onPressHandler = async (itemText: string) => {
    // await addItem("Vegetables");
    // await clearItems();
    const allItems = await seeAllItems();
    console.log(allItems);
  };

  const showModal = () => {
    setShowAddItemModal(true);
  };

  const hideModal = () => {
    setShowAddItemModal(false);
  };

  const onAddItem = async (title: string) => {
    const newItem = await addItem(title);
    setItems((prev) => [...prev, newItem]);
  };

  return (
    <MainScreen>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Storage" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

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
      <FloatingButton onPress={showModal} icon="plus" />
      <AddItemModal
        visible={showAddItemModal}
        onDismiss={hideModal}
        onSubmit={onAddItem}
      />
    </MainScreen>
  );
}

// Styles
const styles = StyleSheet.create({});
