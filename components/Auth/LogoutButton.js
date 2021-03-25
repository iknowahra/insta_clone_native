import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import constants from '../Constants';
import themes from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLogginVar } from '../../contexts/LocalContext';

export default ({}) => {
  const onLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.setItem('isLoggedIn', 'false');
    isLogginVar(false);
    console.log('See you soon!');
  };
  return (
    <Pressable onPress={onLogout} style={styles.container}>
      <Text style={styles.text}>Log out</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themes.blueColor,
    width: constants.width / 5,
    height: 40,
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
});
