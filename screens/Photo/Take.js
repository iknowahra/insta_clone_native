import React, { useState, useEffect, useRef } from 'react';
import * as Permissions from 'expo-permissions';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import Constants from '../../components/Constants';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import themes from '../../contexts/ThemeContext';

export default ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [selected, setSelcted] = useState([]);
  const [album, setAlbum] = useState();
  const cameraRef = useRef();
  const [permission, askForPermission] = Permissions.usePermissions(
    Permissions.CAMERA,
    {
      ask: true,
    },
  );

  const takePhoto = async () => {
    try {
      console.log('takePhoto clicked');
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      console.log('takephoto uri', uri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      console.log('takephoto asset', asset);
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
        onPress: () => navigation.navigation('Home'),
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

  console.log('type', type);
  console.log('hasPermission', hasPermission);

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Pressable
          style={styles.buttonClose}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name="close" size={34} color="black" />
        </Pressable>
        <Pressable
          style={styles.buttonClose}
          onPress={() => navigation.navigate('Add')}
        >
          <Ionicons
            name={
              Platform.OS === 'ios' ? 'ios-albums-outline' : 'md-albums-outline'
            }
            size={36}
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
            size={38}
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
    marginTop: 20,
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
