import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen, KitchenScreen, DiscoverScreen, FavoritesScreen, ShoppingListScreen, RecipeDetailsScreen, SettingsScreen } from '../screens/Screens';
import { colors } from '../theme';
import { useKitchen } from '../state/KitchenContext';
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const icons = {
  Home: ['home-outline', 'home'],
  Kitchen: ['basket-outline', 'basket'],
  Discover: ['compass-outline', 'compass'],
  Favorites: ['heart-outline', 'heart'],
  Shopping: ['bag-handle-outline', 'bag-handle']
};
function BottomTabNavigator() {
  const {
    data
  } = useKitchen();
  const pending = data.shopping.filter(item => !item.purchased).length;
  return <Tabs.Navigator screenOptions={({
    route
  }) => ({
    headerTitle: route.name === 'Home' ? "What's in my Kitchen?" : route.name === 'Kitchen' ? 'My pantry' : route.name,
    headerStyle: {
      backgroundColor: colors.background
    },
    headerShadowVisible: false,
    headerTitleStyle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700'
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      elevation: 0
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '700'
    },
    tabBarItemStyle: {
      paddingTop: 4
    },
    tabBarBadgeStyle: {
      backgroundColor: colors.primary,
      color: 'white',
      fontSize: 10
    },
    tabBarIcon: ({
      color,
      focused
    }) => <View style={{
      width: 45,
      height: 30,
      borderRadius: 15,
      backgroundColor: focused ? colors.light : 'transparent',
      alignItems: 'center',
      justifyContent: 'center'
    }}><Ionicons name={icons[route.name][focused ? 1 : 0]} color={color} size={21} /></View>
  })}>
  <Tabs.Screen name="Home" component={HomeScreen} />
  <Tabs.Screen name="Kitchen" component={KitchenScreen} />
  <Tabs.Screen name="Discover" component={DiscoverScreen} />
  <Tabs.Screen name="Favorites" component={FavoritesScreen} options={{
      tabBarBadge: data.favorites.length || undefined
    }} />
  <Tabs.Screen name="Shopping" component={ShoppingListScreen} options={{
      tabBarBadge: pending || undefined
    }} />
 </Tabs.Navigator>;
}
export default function AppNavigator() {
  return <NavigationContainer theme={{
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border
    }
  }}><Stack.Navigator screenOptions={{
      headerTintColor: colors.primary,
      headerStyle: {
        backgroundColor: colors.background
      },
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: colors.background
      }
    }}><Stack.Screen name="Main" component={BottomTabNavigator} options={{
        headerShown: false
      }} /><Stack.Screen name="Details" component={RecipeDetailsScreen} options={{
        title: 'Something delicious'
      }} /><Stack.Screen name="Settings" component={SettingsScreen} options={{
        title: 'Your little kitchen'
      }} /></Stack.Navigator></NavigationContainer>;
}
