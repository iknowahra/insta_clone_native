import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Main/Home';
import Notification from '../screens/Main/Notification';
import Profile from '../screens/Main/Profile';
import Search from '../screens/Main/Search';
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

export default function TabNavigation({ navigation }) {
  return (
    <Tab.Navigator headerMode="none" mode="modal">
      <Tab.Screen name="Home">
        {() =>
          stackFactory(Home, 'Home', {
            title: 'Home',
            headerRight: () => (
              <Button
                title="hello"
                onPress={() => navigation.navigate('MessageNavigation')}
              ></Button>
            ),
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Search">
        {() =>
          stackFactory(Search, 'Search', {
            title: 'Search',
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Add">
        {() =>
          stackFactory(PhotoNavigation, 'Add', {
            title: 'Add',
          })
        }
      </Tab.Screen>
      <Tab.Screen name="Notification">
        {() =>
          stackFactory(Notification, 'Notification', {
            title: 'Notification',
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
