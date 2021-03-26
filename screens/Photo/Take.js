import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import { View, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import Constants from '../../components/Constants';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import themes from '../../contexts/ThemeContext';
import { getSelectedPhotosVar } from '../../contexts/LocalContext';

export default ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef();
  const [permission, askForPermission] = Permissions.usePermissions(
    Permissions.CAMERA,
    {
      ask: true,
    },
  );

  const takePhoto = async () => {
    try {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      /*  const asset = {
        albumId: '-1739773001',
        creationTime: 1615822114282,
        duration: 0,
        filename: 'IMG_20210315_222834.jpg',
        height: 1280,
        id: '94',
        mediaType: 'photo',
        modificationTime: 1615822126000,
        uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20210315_222834.jpg',
        width: 960,
      }; */
      getSelectedPhotosVar([asset]);
      navigation.navigate('Took');
    } catch (e) {
      console.log('take photo error :', e);
    } finally {
    }
  };

  if (hasPermission === null) {
    Alert.alert('No access to camera', 'Please give it permission', [
      {
        text: 'Grant',
        onPress: () => askForPermission,
      },
      {
        text: 'Back Home',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  }

  if (hasPermission === false) {
    Alert.alert('No access to camera');
    navigation.navigate('Home');
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted' || permission === 'granted');
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      null;
      return () => {
        getSelectedPhotosVar([]);
        navigation.navigate('Select');
        navigation.navigate('Home');
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Pressable
          style={styles.buttonClose}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign
            name="close"
            size={25}
            color="black"
            style={{ marginTop: 2 }}
          />
        </Pressable>
        <Pressable
          style={styles.buttonClose}
          onPress={() => navigation.navigate('Select')}
        >
          <Ionicons
            name={
              Platform.OS === 'ios' ? 'ios-albums-outline' : 'md-albums-outline'
            }
            size={28}
            color="black"
          />
        </Pressable>
        <Pressable
          style={styles.buttonReverse}
          onPress={() => {
            console.log('flip clicked');
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}
        >
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? 'ios-camera-reverse-outline'
                : 'md-camera-reverse-outline'
            }
            size={30}
            color="black"
          />
        </Pressable>
      </View>
      <Camera style={styles.camera} type={type} ref={cameraRef} />
      <Pressable onPress={takePhoto} style={styles.snapButton}>
        <View style={styles.snapButtonInside}></View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  settingContainer: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    width: Constants.width,
    height: Constants.height / 12,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  camera: {
    width: Constants.width,
    height: Constants.height / 1.7,
  },
  button: {},
  text: {},
  snapButton: {
    marginTop: 50,
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 5,
    padding: 10,
    borderColor: themes.lightGreyColor,
    position: 'relative',
  },
  snapButtonInside: {
    backgroundColor: themes.lightGreyColor,
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
  },
});
