import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, Alert, Pressable } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Loader from '../../components/Loader';
import Constants from '../../components/Constants';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons, EvilIcons, AntDesign } from '@expo/vector-icons';
import themes from '../../contexts/ThemeContext';
import { getSelectedPhotosVar } from '../../contexts/LocalContext';

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [permitted, setPermitted] = useState(false);
  const [isSingle, setSingle] = useState(true);
  const [singleSelected, setSingleSelected] = useState({});
  const [multiSelected, setMultiSelected] = useState([]);
  const [chose, setChosen] = useState([]);
  const [album, setAlbum] = useState([]);

  const getAlbum = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync();
    setAlbum(assets);
    initalSelect(assets);
  };

  const initalSelect = (assets) => {
    const { id } = assets && assets[0];
    setSingleSelected(assets[0]);
    setChosen([id]);
    setLoading(false);
    getSelectedPhotosVar([assets[0]]);
  };

  const toggleSingle = () => {
    if (isSingle) {
      setMultiSelected([singleSelected]);
      setSingle(false);
    } else {
      const { id } = singleSelected;
      setChosen([id]);
      setMultiSelected([]);
      setSingle(true);
    }
  };

  const onSelectPhoto = (photo) => {
    const { id } = photo;
    if (isSingle) {
      if (id === singleSelected.id) {
        initalSelect(album);
      } else {
        setSingleSelected(photo);
        setChosen([id]);
        getSelectedPhotosVar([photo]);
      }
    } else {
      const index = chose.indexOf(id);
      if (chose.length >= 10) {
        Alert.alert('Excess photos');
      }
      if (index !== -1) {
        if (chose.length === 1) {
          initalSelect(album);
        } else {
          const filtered = multiSelected.filter((a) => a.id !== id);
          setMultiSelected(filtered);
          setChosen((i) => {
            i.splice(index, 1);
            return i;
          });
          setSingleSelected(filtered[filtered.length - 1]);
          getSelectedPhotosVar(filtered);
        }
      } else {
        setSingleSelected(photo);
        setChosen((i) => [...i, id]);
        setMultiSelected((i) => [...i, photo]);
        getSelectedPhotosVar([...multiSelected, photo]);
      }
    }
  };

  const getPermission = async () => {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== 'granted') {
        setPermitted(false);
        MediaLibrary.requestPermissionsAsync();
        Alert.alert(
          'Ask for permission',
          'We need your permissions on your camera.',
          [
            {
              text: 'Proceed',
              onPress: () => {
                MediaLibrary.requestPermissionsAsync();
              },
            },
          ],
        );
      } else {
        setPermitted(true);
        getAlbum();
      }
    } catch (e) {
      console.log('selct photo error :', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      null;
      return () => {
        setSingle(true);
        setSingleSelected({});
        setMultiSelected([]);
        getAlbum();
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {loading && <Loader />}

      {!permitted && (
        <View
          style={{
            ...styles.mainPhoto,
            backgroundColor: themes.lightGreyColor,
            alignContent: 'center',
            justifyContent: 'center',
          }}
        ></View>
      )}

      {permitted && (
        <Image source={{ uri: singleSelected.uri }} style={styles.mainPhoto} />
      )}

      <View style={styles.middleTab}>
        <View style={styles.middleTabTextRow}>
          <Text style={styles.middleTabText}>Recent Photos</Text>
          <AntDesign
            name="down"
            size={13}
            color="black"
            style={{ marginLeft: 5, marginTop: 5 }}
          />
        </View>

        <View style={styles.middleTabIcons}>
          <Pressable
            style={
              isSingle
                ? styles.buttonIconContainer
                : {
                    ...styles.buttonIconContainer,
                    backgroundColor: themes.charcolGreyColor,
                  }
            }
            onPress={toggleSingle}
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={24}
              color={isSingle ? 'black' : 'white'}
              style={{ marginLeft: 2 }}
            />
          </Pressable>
          <Pressable
            style={styles.buttonIconContainer}
            onPress={() => navigation.navigate('Take')}
          >
            <EvilIcons name="camera" size={28} color="black" />
          </Pressable>
        </View>
      </View>
      <ScrollView>
        <View style={styles.photolistContainer}>
          {album.length ? (
            album.map((photo, index) => {
              const isIncluded = chose.includes(photo.id);
              return (
                <Pressable
                  key={photo.albumId + index}
                  style={
                    (index + 1) % 3 === 2
                      ? { marginHorizontal: 1.5, marginBottom: 1.5 }
                      : { marginBottom: 1.5 }
                  }
                  onPress={() => onSelectPhoto(photo)}
                >
                  <Image
                    style={{
                      ...styles.photolist,
                      opacity: isIncluded ? 0.5 : 1,
                    }}
                    source={{ uri: photo.uri }}
                  />
                </Pressable>
              );
            })
          ) : (
            <View>
              <Text style={{ fontSize: 16 }}>No Photo</Text>
            </View>
          )}
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
    borderColor: themes.borderGreyColor,
    backgroundColor: themes.greyColor,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingLeft: 2.5,
  },
  middleTab: {
    width: Constants.width,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  middleTabText: {
    fontSize: 15,
    color: themes.charcolGreyColor,
  },
  middleTabIcons: {
    flexDirection: 'row',
  },
  middleTabTextRow: {
    flexDirection: 'row',
    paddingTop: 7,
  },
  photolistContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  photolist: {
    width: (Constants.width * 33.09) / 100,
    height: (Constants.width * 33.09) / 100,
  },
});
