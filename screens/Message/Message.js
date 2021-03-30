import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default ({ route }) => (
  <View style={styles.container}>
    <Text>{route?.params?.roomId}</Text>
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
