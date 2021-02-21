import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import UseInput from './UseInput';

const AuthInput = (props) => {
  return (
    <View style={styles.container}>
      <UseInput
        {...props}
        keyboardType={props.keyboardType}
        placeholder={props.placeholder}
        autoCapitalize={props.autoCapitalize}
        value={props.value}
        autoCorrect={props.autoCorrect}
        returnKeyType={props.returnKeyType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 13 },
});

export default AuthInput;
