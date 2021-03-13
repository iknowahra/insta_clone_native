import React from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import Username from '../Username';
import themes from '../../contexts/ThemeContext';
import Constants from '../Constants';

export default ({ uri, postCount }) => {
  return (
    <View style={styles.container}>
      {uri === '#' ? (
        <View style={{ ...styles.mainphoto, ...styles.noImageContainer }}>
          <Text style={styles.noImageText}>#</Text>
        </View>
      ) : (
        <Image source={{ uri }} style={styles.mainphoto} />
      )}
      <View style={styles.infoContainer}>
        <View style={styles.postInfo}>
          <Text style={styles.postCountText}>{postCount}</Text>
          <Text style={styles.greySmallText}>posts</Text>
        </View>
        <Pressable style={styles.buttonWrapper} onPress={() => null}>
          <Text style={styles.buttonText}>Follow</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 20,
    borderBottomColor: themes.greyColor,
    borderBottomWidth: 2,
  },
  mainphoto: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: themes.lightGreyColor,
    borderWidth: 1,
    marginRight: 60,
    marginLeft: 20,
  },
  infoContainer: { justifyContent: 'center', alignContent: 'center' },
  postInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  greySmallText: {
    color: themes.darkGreyColor,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  buttonWrapper: {
    width: Constants.width / 2,
    height: 30,
    justifyContent: 'center',
    backgroundColor: themes.blueColor,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  noImageContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
  postCountText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
