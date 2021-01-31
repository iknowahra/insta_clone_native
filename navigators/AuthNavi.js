import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../screens/Auth/Signup';
import Confirm from '../screens/Auth/Confirm';
import Login from '../screens/Auth/Login';
import AuthHome from '../screens/Auth/AuthHome';

const Stack = createStackNavigator();
export default function AuthNavigation() {
  return (
    <Stack.Navigator initialRouteName="AuthHome">
      <Stack.Screen name="AuthHome" component={AuthHome} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Confirm" component={Confirm} />
    </Stack.Navigator>
  );
}
