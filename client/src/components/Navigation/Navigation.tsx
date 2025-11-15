import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemsCollection from "../../pages/ItemsCollection";
import EventsCollection from "../../pages/EventsCollection";
import EventScreen from "../../pages/Event";
import { useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { EventsStackParamList, RootTabParamList } from "../../types/navigation";

const Tab = createBottomTabNavigator<RootTabParamList>();
const EventsStack = createNativeStackNavigator<EventsStackParamList>();

const EventsNavigator = () => (
  <EventsStack.Navigator screenOptions={{ headerShown: false }}>
    <EventsStack.Screen name="EventsCollection" component={EventsCollection} />
    <EventsStack.Screen name="Event" component={EventScreen} />
  </EventsStack.Navigator>
);

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
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.outlineVariant,
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
          component={EventsNavigator}
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
