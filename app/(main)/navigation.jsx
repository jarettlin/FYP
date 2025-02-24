import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Slot } from 'expo-router';

const Tab = createBottomTabNavigator();

const MainLayout = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'home') iconName = 'home-outline';
            else if (route.name === 'mealplans') iconName = 'fast-food-outline';
            else if (route.name === 'chat') iconName = 'chatbubble-outline';
            else if (route.name === 'profile') iconName = 'person-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="home" component={Slot} />
        <Tab.Screen name="mealplans" component={Slot} />
        <Tab.Screen name="chat" component={Slot} />
        <Tab.Screen name="profile" component={Slot} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainLayout;
