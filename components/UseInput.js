import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import themes from '../contexts/ThemeContext';
import constants from './Constants';

const UseInput = (props) => (
  <TextInput {...props} style={styles.textInput} editable />
);

const styles = StyleSheet.create({
  textInput: {
    width: constants.width / 2,
    padding: 10,
    backgroundColor: themes.greyColor,
    borderWidth: 0.5,
    borderColor: themes.darkGreyColor,
    borderRadius: 4,
  },
});

export default UseInput;
