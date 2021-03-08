import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default () => (
  <View style={styles.container}>
    <Text>result</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
