import React, { useState } from 'react';
import axios from 'axios';
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
  const [uploadPostMutation, { data: mutationData, loading }] = useMutation(
    UPLOAD_PHOTO,
  );
  const onShareData = async () => {
    try {
      const formData = new FormData();
      for (let photo of photosData?.files) {
        formData.append('photos', {
          name: photo.filename,
          type: `image/${photo.filename.split('.')[1].toLowerCase()}`,
          uri: photo.uri,
        });
      }
      const {
        data: { filesArray },
      } = await axios({
        method: 'post',
        url: 'http://10.0.2.2:5000/api/upload',
        data: formData,
        headers: {
          Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
      });

      const files = [];
      filesArray.forEach((file) => files.push({ url: file.location }));

      await uploadPostMutation({
        variables: {
          caption: photosData.caption,
          location: photosData.location,
          files: JSON.stringify(files),
        },
      });
    } catch (e) {
      console.log('upload error : ', e);
      Alert.alert('Network Error', 'Sorry for the error. Please try later.');
    } finally {
      if (mutationData?.uploadPost?.ok) {
        navigation.navigate('Profile');
      }
    }
  };

  return (
    <Stack.Navigator initialRouteName="Select">
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
