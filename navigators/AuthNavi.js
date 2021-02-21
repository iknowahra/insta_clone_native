import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../screens/Auth/Signup';
import SignupStr from '../screens/Auth/Signup1';
import SignupMid from '../screens/Auth/Signup2';
import SignupFin from '../screens/Auth/Signup3';
import SignupOpt from '../screens/Auth/Signup4';
import Confirm from '../screens/Auth/Confirm';
import Login from '../screens/Auth/Login';
import AuthHome from '../screens/Auth/AuthHome';
import LostPassword from '../screens/Auth/Lost';

const Stack = createStackNavigator();
export default function AuthNavigation() {
  return (
    <Stack.Navigator initialRouteName="Signup" headerMode="none">
      <Stack.Screen name="AuthHome" component={AuthHome} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="SignupStr" component={SignupStr} />
      <Stack.Screen name="SignupMid" component={SignupMid} />
      <Stack.Screen name="SignupFin" component={SignupFin} />
      <Stack.Screen name="SignupOpt" component={SignupOpt} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LostPassword" component={LostPassword} />
      <Stack.Screen name="Confirm" component={Confirm} />
    </Stack.Navigator>
  );
}
