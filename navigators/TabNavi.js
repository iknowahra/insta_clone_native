import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Notification from '../screens/Notification';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import PhotoNavigation from './PhotoNavi';
import { Button } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackFactory = (initialRoute, name, customConfig) => (
  <Stack.Navigator>
    <Stack.Screen
      name={name}
      component={initialRoute}
      options={{ ...customConfig }}
    />
  </Stack.Navigator>
);

export default function TabNavigation() {
  return (
    <Tab.Navigator headerMode="none" mode="modal">
      <Tab.Screen name="Home">
        {() =>
          stackFactory(Home, 'Home', {
            title: 'Home',
            headerRight: () => <Button title="hello"></Button>,
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Search">
        {() =>
          stackFactory(Search, 'Search', {
            title: 'Search',
            headerRight: () => <Button title="Search"></Button>,
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Add">
        {() =>
          stackFactory(PhotoNavigation, 'Add', {
            title: 'Add',
            headerRight: () => <Button title="Add"></Button>,
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Notification">
        {() =>
          stackFactory(Notification, 'Notification', {
            title: 'Notification',
            headerRight: () => <Button title="Notification"></Button>,
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() =>
          stackFactory(Profile, 'Profile', {
            title: 'Profile',
            headerRight: () => <Button title="Profile"></Button>,
          })
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}
