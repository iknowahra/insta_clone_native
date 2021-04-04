import * as React from 'react';
import { Image, Platform, Pressable, View, Text } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Main/Home';
import Notification from '../screens/Main/Notification';
import Profile from '../screens/Main/Profile/Profile';
import Comments from '../screens/Main/Comments';
import PhotoNavigation from './PhotoNavi';
import UserPosts from '../components/Post/UserPosts';
import LogoutButton from '../components/Auth/LogoutButton';
import Logo from '../assets/logoLetter.png';
import themes from '../contexts/ThemeContext';
import SearchNavigation from './SearchNavi';
import HomeNavigation from './HomeNavi';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackFactory = (initialRoute, name, customConfig, sibling, sibling2) => (
  <Stack.Navigator>
    <Stack.Screen
      name={name}
      component={initialRoute}
      options={{ ...customConfig }}
    />
    {sibling}
    {sibling2}
  </Stack.Navigator>
);

export default function TabNavigation({ navigation }) {
  return (
    <Tab.Navigator
      mode="modal"
      initialRouteName="Home"
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
        {() => <HomeNavigation />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{
          unmountOnBlur: true,
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
        {() => <SearchNavigation />}
      </Tab.Screen>
      <Tab.Screen
        name="Add"
        options={{
          unmountOnBlur: true,
          tabBarVisible: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name={'plussquareo'}
              color={focused ? 'black' : themes.darkGreyColor}
              size={26}
            />
          ),
        }}
      >
        {() => <PhotoNavigation />}
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
            headerStyle:
              Platform.OS === 'ios'
                ? { shadowColor: 'transparent' }
                : { backgroundColor: '#fff', elevation: 0 },
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
          stackFactory(
            Profile,
            'Profile',
            {
              headerRight: () => <LogoutButton />,
              headerTitleAlign: 'center',
              headerStyle:
                Platform.OS === 'ios'
                  ? { shadowColor: 'transparent' }
                  : { backgroundColor: '#fff', elevation: 0 },
            },
            <Stack.Screen
              name="Comments"
              component={Comments}
              options={{
                headerStyle:
                  Platform.OS === 'ios'
                    ? { shadowColor: 'transparent' }
                    : { backgroundColor: '#fff', elevation: 0 },
              }}
            />,
            <Stack.Screen
              name="UserPosts"
              component={UserPosts}
              options={({ route }) => ({
                headerTitle: (
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: themes.darkGreyColor,
                      }}
                    >
                      {route.params.tabTitle}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      Posts
                    </Text>
                  </View>
                ),
                headerStyle:
                  Platform.OS === 'ios'
                    ? { shadowColor: 'transparent' }
                    : { backgroundColor: '#fff', elevation: 0 },
                headerTitleAlign: 'center',
              })}
            />,
          )
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}
