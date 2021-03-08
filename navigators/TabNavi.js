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
import { Image, Button, Platform, Pressable, View, Text } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import Comments from '../screens/Main/Comments';
import Result from '../components/Result';
import SearchBar from '../components/SearchBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackFactory = (initialRoute, name, customConfig, sibling) => (
  <Stack.Navigator>
    <Stack.Screen
      name={name}
      component={initialRoute}
      options={{ ...customConfig }}
    />
    {sibling}
  </Stack.Navigator>
);

export default function TabNavigation({ navigation, previous }) {
  return (
    <Tab.Navigator
      mode="modal"
      initialRouteName="Search"
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
          stackFactory(
            Home,
            'Home',
            {
              headerTitle: () => (
                <Image source={Logo} style={{ width: 110, height: 50 }} />
              ),
              headerLeft: () => (
                <Pressable onPress={() => null}>
                  <Ionicons
                    name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
                    size={30}
                    style={{ marginLeft: 10 }}
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
                      Platform.OS === 'ios'
                        ? 'ios-paper-plane-outline'
                        : 'md-paper-plane-outline'
                    }
                    size={26}
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              ),
            },
            <Stack.Screen name="Comments" component={Comments} />,
          )
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
          stackFactory(
            Search,
            'Search',
            {
              headerTitle: () => <SearchBar />,
              headerTitleAlign: 'center',
            },
            <Stack.Screen
              name="Result"
              component={Result}
              options={({ route }) => ({
                headerTitle: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="search" size={20} color="black" />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      " {route.params.term} "
                    </Text>
                  </View>
                ),
                headerTitleAlign: 'center',
              })}
            />,
          )
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
