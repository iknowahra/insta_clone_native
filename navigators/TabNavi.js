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
import Select from '../screens/Photo/Select';
import Take from '../screens/Photo/Take';
import Upload from '../screens/Photo/Upload';

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
      initialRouteName="Add"
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
              headerStyle:
                Platform.OS === 'ios'
                  ? { shadowColor: 'transparent' }
                  : { backgroundColor: '#fff', elevation: 0 },
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
                headerStyle:
                  Platform.OS === 'ios'
                    ? { shadowColor: 'transparent' }
                    : { backgroundColor: '#fff', elevation: 0 },
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
        {() => <SearchNavigation />}
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
          stackFactory(
            Select,
            'Add',
            {
              headerTitle: () => (
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                  New Post
                </Text>
              ),
              headerStyle:
                Platform.OS === 'ios'
                  ? { shadowColor: 'transparent', height: 70 }
                  : { backgroundColor: '#fff', elevation: 0, height: 70 },
              headerLeft: () => (
                <Pressable
                  style={{ paddingLeft: 10 }}
                  onPress={() => navigation.navigate('Home')}
                >
                  <AntDesign name="close" size={30} color="black" />
                </Pressable>
              ),
              headerRight: () => (
                <Pressable style={{ paddingRight: 10 }}>
                  <Text
                    style={{
                      color: themes.blueColor,
                      fontSize: 17,
                      fontWeight: 'bold',
                    }}
                  >
                    Next
                  </Text>
                </Pressable>
              ),
              headerTitleAlign: 'center',
            },
            <Stack.Screen
              name="Take"
              component={Take}
              options={{
                headerShown: false,
              }}
            />,
            <Stack.Screen name="Upload" component={Upload} />,
          )
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
