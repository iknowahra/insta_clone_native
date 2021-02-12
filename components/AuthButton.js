import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import constants from './Constants';
import themes from '../contexts/ThemeContext';

const AuthButton = ({ text, onPress, disabled, loading = false }) => (
  <Pressable onPress={onPress} disabled={disabled || loading}>
    <View
      style={
        !disabled && !loading
          ? styles.container
          : { ...styles.container, backgroundColor: themes.inactiveBlueColor }
      }
    >
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  </Pressable>
);

AuthButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themes.blueColor,
    width: constants.width / 1.2,
    height: 45,
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default AuthButton;
