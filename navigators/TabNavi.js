import * as React from 'react';
import { Image, Platform, Pressable, View, Text } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Main/Home';
import Notification from '../screens/Main/Notification';
import Profile from '../screens/Main/Profile/Profile';
import YourProfile from '../screens/Main/Profile/YourProfile';
import Search from '../screens/Main/Search/Search';
import Comments from '../screens/Main/Comments';
import Result from '../screens/Main/Search/SearchResult';
import SearchBar from '../components/Search/SearchBar';
import PhotoNavigation from './PhotoNavi';
import UserPosts from '../components/Post/UserPosts';
import LogoutButton from '../components/Auth/LogoutButton';
import Logo from '../assets/logoLetter.png';
import themes from '../contexts/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const stackFactory = (
  initialRoute,
  name,
  customConfig,
  sibling,
  sibling2,
  sibling3,
) => (
  <Stack.Navigator>
    <Stack.Screen
      name={name}
      component={initialRoute}
      options={{ ...customConfig }}
    />
    {sibling}
    {sibling2}
    {sibling3}
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
            <Stack.Screen
              name="Comments"
              component={Comments}
              options={{
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
              }}
            />,
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
                  <View>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {route.params.term}
                    </Text>
                  </View>
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <Pressable style={{ marginRight: 25 }} onPress={() => null}>
                    <Feather name="more-horizontal" size={24} />
                  </Pressable>
                ),
              })}
            />,
            <Stack.Screen
              name="UserPosts"
              component={UserPosts}
              options={{ headerTitle: 'Explore', headerTitleAlign: 'center' }}
            />,
            <Stack.Screen name={'YourProfile'} component={YourProfile} />,
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
          stackFactory(
            Profile,
            'Profile',
            {
              headerRight: () => <LogoutButton />,
              headerTitleAlign: 'center',
            },
            <Stack.Screen name="Comments" component={Comments} />,
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
                headerTitleAlign: 'center',
              })}
            />,
          )
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}
