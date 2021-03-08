import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export default ({ username }) => {
  return (
    <Text onPress={() => null} style={styles.text}>
      {username}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: { fontWeight: 'bold', fontSize: 18, marginRight: 5 },
});
