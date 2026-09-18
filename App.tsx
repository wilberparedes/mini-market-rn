import React, { useEffect } from 'react';
import { Appearance } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';

import { RootNavigator } from '@navigation/RootNavigator';
import { queryClient } from './src/queryClient';
import { useFavoriteStore } from '@store/favorites.store';

Appearance.setColorScheme('light');

const App = () => {
  const loadFavorites = useFavoriteStore((state) => state.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
