import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ItemsCollection from "../../pages/ItemsCollection";
import EventsCollection from "../../pages/EventsCollection";
import { useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
            borderTopWidth: 1,
          },
          tabBarButton: (props) => {
            // @ts-expect-error: hide
            return <TouchableOpacity {...props} activeOpacity={1} />;
          },
        }}
      >
        <Tab.Screen
          name="Events"
          component={EventsCollection}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="calendar-today" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Items"
          component={ItemsCollection}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="format-list-bulleted"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
