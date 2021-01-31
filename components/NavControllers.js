import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  userIsLoggedIn,
  userLogIn,
  userLogOut,
  AuthContext,
} from '../contexts/AuthContext';
import AuthNavigation from '../Navigators/AuthNavi';
import MainNavigation from '../Navigators/MainNavi';

export default () => {
  const isLoggedIn = true;
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
