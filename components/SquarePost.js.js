import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Constants from './Constants';

export default ({ files = [], index }) => {
  return (
    <View style={(index + 1) % 3 === 2 ? styles.container2 : styles.container}>
      <Image source={{ uri: files[0].url }} style={styles.photo} />
    </View>
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
