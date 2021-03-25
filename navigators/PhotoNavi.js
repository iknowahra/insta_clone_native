import React, { useState } from 'react';
import { useReactiveVar, useMutation } from '@apollo/client';
import { Alert, Platform, Pressable, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Select from '../screens/Photo/Select';
import Take from '../screens/Photo/Take';
import Upload from '../screens/Photo/Upload';
import Took from '../screens/Photo/Took';
import themes from '../contexts/ThemeContext';
import { sendPhotosVar } from '../contexts/LocalContext';
import { UPLOAD_PHOTO } from '../contexts/Queries';

const Stack = createStackNavigator();
export default function PhotoNavigation() {
  const navigation = useNavigation();
  const photosData = useReactiveVar(sendPhotosVar);
  const [uploadPostMutation, { data, loading }] = useMutation(UPLOAD_PHOTO);
  const onShareData = async () => {
    try {
      await uploadPostMutation({
        variables: photosData,
      });
      if (data?.uploadPost?.error) {
        Alert.alert('Error', 'Sorry for the error. Please try agian.');
      }
    } catch (e) {
      console.log('upload error : ', e);
      Alert.alert('Network Error', 'Sorry for the error. Please try later.');
    } finally {
      if (data?.uploadPost?.ok) {
        navigation.navigate('Profile');
      }
    }
  };

  return (
    <Stack.Navigator initialRouteName="Take">
      <Stack.Screen
        name="Select"
        component={Select}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>New Post</Text>
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
              <AntDesign name="close" size={27} color="black" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              style={{ paddingRight: 13 }}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text
                style={{
                  color: themes.blueColor,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >
                Next
              </Text>
            </Pressable>
          ),
          headerStyle:
            Platform.OS === 'ios'
              ? { shadowColor: 'transparent' }
              : { backgroundColor: '#fff', elevation: 0 },
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Take"
        component={Take}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>New Post</Text>
          ),
          headerStyle:
            Platform.OS === 'ios'
              ? { shadowColor: 'transparent', height: 70 }
              : { backgroundColor: '#fff', elevation: 0, height: 70 },
          headerRight: () => (
            <Pressable
              style={{ paddingRight: 13 }}
              onPress={onShareData}
              disabled={loading ? true : false}
            >
              <Text
                style={{
                  color: !loading ? themes.blueColor : themes.inactiveBlueColor,
                  fontSize: 17,
                  fontWeight: 'bold',
                }}
              >
                Share
              </Text>
            </Pressable>
          ),
          headerStyle:
            Platform.OS === 'ios'
              ? { shadowColor: 'transparent' }
              : { backgroundColor: '#fff', elevation: 0 },
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Took"
        component={Took}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
