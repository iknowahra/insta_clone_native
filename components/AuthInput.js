import React from 'react';
import { View, StyleSheet } from 'react-native';
import UseInput from './UseInput';
import themes from '../contexts/ThemeContext';
import constants from './Constants';

const AuthInput = (props) => {
  return (
    <View style={styles.container}>
      <UseInput
        {...props}
        style={styles.textInput}
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
  textInput: {
    width: constants.width / 1.2,
    padding: 10,
    backgroundColor: themes.greyColor,
    borderWidth: 0.5,
    borderColor: themes.darkGreyColor,
    borderRadius: 4,
  },
});

export default AuthInput;
