import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SelectPhoto from '../screens/Photo/Select';
import TakePhoto from '../screens/Photo/Take';
import UploadPhoto from '../screens/Photo/Upload';

const Tab = createMaterialTopTabNavigator();
function PhotoTabNavigation() {
  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="SelectPhoto" component={SelectPhoto} />
      <Tab.Screen name="TakePhoto" component={TakePhoto} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
export default function MainNavigation() {
  return (
    <Stack.Navigator initialRouteName="PhotoTabNavigation">
      <Stack.Screen
        name="UploadPhoto"
        component={UploadPhoto}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PhotoTabNavigation"
        component={PhotoTabNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
