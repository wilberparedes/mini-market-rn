import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';

import { RootNavigator } from '@navigation/RootNavigator';
import { queryClient } from './src/queryClient';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
