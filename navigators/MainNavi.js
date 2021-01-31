import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavi';

const Stack = createStackNavigator();
export default function MainNavigation() {
  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName="TabNavigation"
    >
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
    </Stack.Navigator>
  );
}
