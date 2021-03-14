import React from 'react';
import { View, StyleSheet } from 'react-native';
import FullFeeds from './FullFeeds';

export default ({ route }) => {
  return (
    <View style={styles.container}>
      <FullFeeds {...route?.params} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
