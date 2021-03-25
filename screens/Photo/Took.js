import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Constants from '../../components/Constants';
import { AntDesign } from '@expo/vector-icons';
import themes from '../../contexts/ThemeContext';
import { getSelectedPhotosVar } from '../../contexts/LocalContext';
import { useReactiveVar } from '@apollo/client';

export default ({ navigation }) => {
  const takenPhoto = useReactiveVar(getSelectedPhotosVar);

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Pressable
          style={styles.buttonClose}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="black" />
        </Pressable>

        <Text
          style={styles.nextButton}
          onPress={() => navigation.navigate('Upload')}
        >
          Next
        </Text>
      </View>
      <Image style={styles.camera} source={{ uri: takenPhoto[0]?.uri }} />
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
  nextButton: {
    color: themes.blueColor,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 5,
  },
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
