import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProductsScreen } from '@screens/ProductsScreen';
import { ProductDetailScreen } from '@screens/ProductDetailScreen';
import type { ProductsStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export const ProductsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2C2D5B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Productos',
        }}
      />

      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Detalle',
        }}
      />
    </Stack.Navigator>
  );
};
