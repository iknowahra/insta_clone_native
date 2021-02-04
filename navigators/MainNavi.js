import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavi';
import PhotoNavigation from './PhotoNavi';
import MessageNavigation from './MessageNavi';

const Stack = createStackNavigator();
export default function MainNavigation() {
  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName="TabNavigation"
    >
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
      <Stack.Screen name="PhotoNavigation" component={PhotoNavigation} />
      <Stack.Screen name="MessageNavigation" component={MessageNavigation} />
    </Stack.Navigator>
  );
}
