import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import UseInput from '../../components/UseInput';
import themes from '../../contexts/ThemeContext';
import Constants from '../../components/Constants';
import {
  getSelectedPhotosVar,
  sendPhotosVar,
} from '../../contexts/LocalContext';

export default ({ navigation }) => {
  const data = useReactiveVar(sendPhotosVar);
  const selectedPhoto = useReactiveVar(getSelectedPhotosVar);
  const [caption, onChangeCaption] = useState('');
  const [location, onChangeLocation] = useState('');
  const [files, setFiles] = useState('');

  const onUpdateCaption = (caption) => {
    onChangeCaption(caption);
    sendPhotosVar({ caption, location, files });
  };

  const onUpdateLocation = (location) => {
    onChangeLocation(location);
    sendPhotosVar({ caption, location, files });
  };

  useEffect(() => {
    const photos = [];
    selectedPhoto?.forEach((photo) => photos.push({ url: photo.uri }));
    setFiles(JSON.stringify(photos));
  }, []);

  useFocusEffect(
    useCallback(() => {
      null;
      return () => {
        getSelectedPhotosVar([]);
        sendPhotosVar({});
        onChangeCaption('');
        onChangeLocation('');
        navigation.navigate('Select');
        navigation.navigate('Profile');
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.photoHeader}>
        <Image source={{ uri: selectedPhoto[0]?.uri }} style={styles.photo} />
        <UseInput
          style={styles.captionInput}
          placeholder="Input caption..."
          autoCapitalize={'none'}
          value={caption}
          autoCorrect={false}
          underlineColorAndroid="transparent"
          onChangeText={(caption) => onUpdateCaption(caption)}
          multiline={true}
        />
      </View>
      <View style={styles.locationGuide}>
        <Text style={styles.locationGuideText}>Add Location</Text>
        <UseInput
          style={styles.locationInput}
          placeholder="Use comma (,) to separate location"
          autoCapitalize={'none'}
          value={location}
          autoCorrect={false}
          underlineColorAndroid="transparent"
          onChangeText={(location) => onUpdateLocation(location)}
          textContentType="location"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  photoHeader: {
    borderBottomColor: themes.borderGreyColor,
    borderBottomWidth: 0.8,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  photo: {
    width: 80,
    height: 80,
    marginLeft: 15,
  },
  captionInput: {
    width: Constants.width / 1.35,
    height: 80,
    paddingLeft: 15,
    paddingTop: 5,
    textAlignVertical: 'top',
  },
  locationInput: {
    width: Constants.width / 1.07,
    height: 40,
    marginLeft: 15,
    backgroundColor: themes.veryLightGreyColor,
  },
  locationGuide: {
    paddingVertical: 15,
    borderBottomColor: themes.borderGreyColor,
    borderBottomWidth: 0.8,
  },
  locationGuideText: {
    marginBottom: 5,
    marginLeft: 15,
  },
});
