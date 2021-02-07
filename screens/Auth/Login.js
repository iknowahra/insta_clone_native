import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';

export default () => (
  <View style={styles.container}>
    <AuthInput value="" placeholder="Email" keyboardType="email-address" />
    <AuthButton onPress={() => null} text="Log In" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
