import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default () => (
  <View style={styles.container}>
    <Text>lost password</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
