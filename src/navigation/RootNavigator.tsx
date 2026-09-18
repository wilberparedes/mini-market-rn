import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FavoritesScreen } from '@screens/FavoritesScreen';
import { ProductsStack } from './ProductsStack';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: '#2C2D5B',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#2C2D5B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          title: 'Productos',
          headerShown: false,
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Mis Favoritos',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
};
