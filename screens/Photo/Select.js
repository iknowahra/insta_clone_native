import React, { useState, useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import { View, Text, StyleSheet, Image, Alert, Pressable } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Loader from '../../components/Loader';
import Constants from '../../components/Constants';
import { ScrollView } from 'react-native-gesture-handler';
import SquarePost from '../../components/Post/SquarePost.js';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import themes from '../../contexts/ThemeContext';

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [permitted, setPermitted] = useState(false);
  const [selected, setSelcted] = useState({});
  const [album, setAlbum] = useState([]);

  const getAlbum = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync();
    console.log('asset', assets);
    setAlbum(assets);
    setSelcted(assets[0]);
    setLoading(false);
  };

  const getPermission = async () => {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== 'granted') {
        MediaLibrary.requestPermissionsAsync();
        Alert.alert(
          'Ask for permission',
          'If you want to proceed, we need your permissions on your camera.',
          [
            {
              text: 'Proceed',
              onPress: () => MediaLibrary.requestPermissionsAsync,
            },
          ],
        );
      } else {
        setPermitted(true);
        getAlbum();
      }
    } catch (e) {
      console.log('selct photo error :', e);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);
  console.log(selected);

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      {!loading && selected ? (
        <Image source={{ uri: selected.uri }} style={styles.mainPhoto} />
      ) : (
        <View
          style={{
            ...styles.mainPhoto,
            backgroundColor: themes.lightGreyColor,
          }}
        ></View>
      )}
      <View style={styles.middleTab}>
        <Text style={styles.middleTabText}>Recent Photos</Text>
        <View style={styles.middleTabIcons}>
          <Pressable
            style={styles.buttonIconContainer}
            onPress={() => setSelcted()}
          >
            <MaterialIcons name="add-photo-alternate" size={29} color="black" />
          </Pressable>
          <Pressable
            style={styles.buttonIconContainer}
            onPress={() => navigation.navigate('Take')}
          >
            <EvilIcons name="camera" size={33} color="black" />
          </Pressable>
        </View>
      </View>
      <ScrollView>
        <View style={styles.photolistContainer}>
          {album &&
            album.map((photo, index) => (
              <Pressable
                key={photo.albumId + index}
                style={
                  (index + 1) % 3 === 2
                    ? { marginHorizontal: 1.5, marginBottom: 1.5 }
                    : { marginBottom: 1.5 }
                }
                onPress={() => setSelcted(photo)}
              >
                <Image
                  style={{
                    ...styles.photolist,
                    opacity: photo.id === selected?.id ? 0.5 : 1,
                  }}
                  source={{ uri: photo.uri }}
                />
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  mainPhoto: {
    width: Constants.width,
    height: Constants.height / 1.9,
  },
  buttonIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: themes.lightGreyColor,
    backgroundColor: themes.greyColor,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  middleTab: {
    width: Constants.width,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 3,
  },
  middleTabText: {
    fontSize: 18,
  },
  middleTabIcons: {
    flexDirection: 'row',
  },
  photolistContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  photolist: {
    width: (Constants.width * 33.09) / 100,
    height: (Constants.width * 33.09) / 100,
  },
});
