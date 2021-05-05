import * as React from 'react';
import { Pressable, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import Logo from '../assets/logoLetter.png';
import Home from '../screens/Main/Home';
import Comments from '../screens/Main/Comments';
import YourProfile from '../screens/Main/Profile/YourProfile';

const Stack = createStackNavigator();
export default function HomeNavigation() {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Image source={Logo} style={{ width: 110, height: 50 }} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() =>
                navigation.navigate('PhotoNavigation', { screen: 'Take' })
              }
            >
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
            <Pressable onPress={() => navigation.navigate('MessageNavigation')}>
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
        })}
      />
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
            <Pressable onPress={() => navigation.navigate('MessageNavigation')}>
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
      />
      <Stack.Screen name="YourProfile" component={YourProfile} />
    </Stack.Navigator>
  );
}
