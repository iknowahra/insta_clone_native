import * as React from 'react';
import { Pressable, Platform } from 'react-native';
import {
  createStackNavigator,
  HeaderBackButton,
} from '@react-navigation/stack';
import Message from '../screens/Message/Message';
import Messages from '../screens/Message/Messages';
import Invite from '../screens/Message/Invite';
import SearchRoom from '../screens/Message/Search';
import YourProfile from '../screens/Main/Profile/YourProfile';

const Stack = createStackNavigator();
export default function MessageNavigation() {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Message"
        component={Message}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Invite"
        component={Invite}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchRoom"
        component={SearchRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="YourProfile" component={YourProfile} />
    </Stack.Navigator>
  );
}
