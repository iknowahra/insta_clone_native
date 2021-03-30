import * as React from 'react';
import { Pressable, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Message from '../screens/Message/Message';
import Messages from '../screens/Message/Messages';
import Invite from '../screens/Message/Invite';
import { Entypo } from '@expo/vector-icons';
import { HeaderBackButton } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function MessageNavigation() {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderBackButton
              style={{ marginLeft: 5 }}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => (
            <Pressable
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Invite')}
            >
              <Entypo name="new-message" size={24} color="black" />
            </Pressable>
          ),
          headerTitleContainerStyle: { marginLeft: -30 },
          headerTitleStyle: { fontSize: 25 },
          headerStyle:
            Platform.OS === 'ios'
              ? { shadowColor: 'transparent' }
              : { backgroundColor: '#fff', elevation: 0 },
        })}
      />
      <Stack.Screen name="Invite" component={Invite} />
    </Stack.Navigator>
  );
}
