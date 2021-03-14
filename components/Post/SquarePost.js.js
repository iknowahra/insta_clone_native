import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from '../Constants';

export default ({ files = [], id, index, posts, tabTitle }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('UserPosts', { index, posts, tabTitle });
      }}
    >
      <Image source={{ uri: files[0].url }} style={styles.photo} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 2,
  },
  container2: {
    paddingBottom: 2,
    paddingHorizontal: 1.5,
  },
  photo: {
    width: (Constants.width * 33.09) / 100,
    height: (Constants.width * 33.09) / 100,
  },
});
