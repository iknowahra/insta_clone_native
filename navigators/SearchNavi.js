import * as React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import SearchBar from '../components/Search/SearchBar';

import Search from '../screens/Main/Search/Search';
import Result from '../screens/Main/Search/SearchResult';
import YourProfile from '../screens/Main/Profile/YourProfile';
import Comments from '../screens/Main/Comments';
import UserPosts from '../components/Post/UserPosts';

const Stack = createStackNavigator();

export default function SearchNavigation() {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerTitle: () => <SearchBar />,
          headerTitleAlign: 'center',
        }}
      />
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
      />
      <Stack.Screen
        name="UserPosts"
        component={UserPosts}
        options={{ headerTitle: 'Explore', headerTitleAlign: 'center' }}
      />
      <Stack.Screen name="YourProfile" component={YourProfile} />
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  );
}
