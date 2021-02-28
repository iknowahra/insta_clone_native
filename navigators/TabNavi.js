import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Main/Home';
import Notification from '../screens/Main/Notification';
import Profile from '../screens/Main/Profile';
import Search from '../screens/Main/Search';
import PhotoNavigation from './PhotoNavi';
import Logo from '../assets/logoLetter.png';
import themes from '../contexts/ThemeContext';
import { Image, Button, Platform, Pressable } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

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

export default function TabNavigation({ navigation, previous }) {
  return (
    <Tab.Navigator
      mode="modal"
      tabBarOptions={{
        showLabel: false,
        tabStyle: {
          backgroundColor: '#FAFAFA',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                Platform.OS === 'ios'
                  ? focused
                    ? 'ios-home-sharp'
                    : 'ios-home-outline'
                  : focused
                  ? 'md-home-sharp'
                  : 'md-home-outline'
              }
              color={focused ? 'black' : themes.darkGreyColor}
              size={28}
            />
          ),
        }}
      >
        {() =>
          stackFactory(Home, 'Home', {
            headerTitle: () => (
              <Image source={Logo} style={{ width: 120, height: 60 }} />
            ),
            headerLeft: () => (
              <Pressable onPress={() => null}>
                <Ionicons
                  name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
                  size={33}
                  style={{ marginLeft: 20 }}
                />
              </Pressable>
            ),
            headerTitleAlign: 'center',
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate('MessageNavigation')}
              >
                <Ionicons
                  name={
                    Platform.OS === 'ios' ? 'ios-paper-plane' : 'md-paper-plane'
                  }
                  size={28}
                  style={{ marginRight: 20 }}
                />
              </Pressable>
            ),
          })
        }
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                Platform.OS === 'ios'
                  ? focused
                    ? 'ios-search'
                    : 'ios-search-outline'
                  : focused
                  ? 'md-search'
                  : 'md-search-outline'
              }
              color={focused ? 'black' : themes.darkGreyColor}
              size={28}
            />
          ),
        }}
      >
        {() =>
          stackFactory(Search, 'Search', {
            headerLeft: () => {
              previous ? (
                <Button text="back" onPress={navigation.goBack} />
              ) : undefined;
            },
          })
        }
      </Tab.Screen>
      <Tab.Screen
        name="Add"
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name={'plussquareo'}
              color={focused ? 'black' : themes.darkGreyColor}
              size={26}
            />
          ),
        }}
      >
        {() =>
          stackFactory(PhotoNavigation, 'Add', {
            title: 'Add',
          })
        }
      </Tab.Screen>
      <Tab.Screen
        name="Notification"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                Platform.OS === 'ios'
                  ? focused
                    ? 'ios-heart'
                    : 'ios-heart-outline'
                  : focused
                  ? 'md-heart'
                  : 'md-heart-outline'
              }
              color={focused ? 'black' : themes.darkGreyColor}
              size={30}
            />
          ),
        }}
      >
        {() =>
          stackFactory(Notification, 'Notification', {
            title: 'Notification',
          })
        }
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                Platform.OS === 'ios'
                  ? focused
                    ? 'ios-person-circle'
                    : 'ios-person-circle-outline'
                  : focused
                  ? 'md-person-circle'
                  : 'md-person-circle-outline'
              }
              color={focused ? 'black' : themes.darkGreyColor}
              size={32}
            />
          ),
        }}
      >
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
