/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppColors } from './styles/common';

import TopicsListContainer from './components/TopicsListContainer';
import ArticlesListContainer from './components/ArticlesListContainer';
import ArticleDetailsContainer from './components/ArticleDetailsContainer';

const Stack = createStackNavigator();

const MyTheme = {
  colors: {
    background: AppColors.WHITE,
  },
};

function App() {
  return (
    <>
      <StatusBar backgroundColor={AppColors.ACCENT_DARK} />

      <NavigationContainer theme={MyTheme}>

        {/* Set the screen titles to nothing, the titles will be updated in the components */}
        <Stack.Navigator
          initialRouteName="Topics"
          screenOptions={{
            headerStyle: {
              backgroundColor: AppColors.ACCENT,
            },
            headerTintColor: AppColors.WHITE,
          }}
        >
          <Stack.Screen
            name="Topics"
            component={TopicsListContainer}
            options={{ title: '' }}
          />
          <Stack.Screen
            name="Articles"
            component={ArticlesListContainer}
            options={{ title: '' }}
          />
          <Stack.Screen
            name="ArticleDetails"
            component={ArticleDetailsContainer}
            options={{ title: '' }}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </>
  );
}

export default App;
