import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import constants from '../Constants';
import themes from '../../contexts/ThemeContext';

const AuthButton = ({ text, onPress, disabled, loading = false, image }) => (
  <Pressable onPress={onPress} disabled={disabled && loading}>
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
        <View style={styles.innerContainer}>
          {image ? <Image source={image} style={styles.image} /> : null}
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </View>
  </Pressable>
);

AuthButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  image: PropTypes.number,
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
    fontWeight: 'bold',
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  innerContainer: {
    flexDirection: 'row',
  },
});

export default AuthButton;
