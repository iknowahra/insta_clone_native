import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  userIsLoggedIn,
  userLogIn,
  userLogOut,
  AuthContext,
} from '../contexts/AuthContext';
import AuthNavigation from '../navigators/AuthNavi';
import MainNavigation from '../navigators/MainNavi';

export default () => {
  const isLoggedIn = false;
  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
