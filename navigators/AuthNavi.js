import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../screens/Auth/Signup';
import Confirm from '../screens/Auth/Confirm';
import Login from '../screens/Auth/Login';
import AuthHome from '../screens/Auth/AuthHome';
import LostPassword from '../screens/Auth/Lost';

const Stack = createStackNavigator();
export default function AuthNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="AuthHome" component={AuthHome} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LostPassword" component={LostPassword} />
      <Stack.Screen name="Confirm" component={Confirm} />
    </Stack.Navigator>
  );
}
