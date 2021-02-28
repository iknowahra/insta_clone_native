import React from 'react';
import { View, StyleSheet } from 'react-native';
import Loader from '../../components/Loader';

export default () => (
  <View style={styles.container}>
    <Loader />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
