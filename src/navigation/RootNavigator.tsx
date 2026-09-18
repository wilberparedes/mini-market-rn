import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FavoritesScreen } from '@screens/FavoritesScreen';
import { ProductsStack } from './ProductsStack';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          title: 'Productos',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Mis Favoritos',
        }}
      />
    </Tab.Navigator>
  );
};
