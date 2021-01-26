import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {
  userIsLoggedIn,
  userLogIn,
  userLogOut,
  AuthContext,
} from '../contexts/AuthContext';

export default () => {
  const logIn = userLogIn();
  const logOut = userLogOut();
  const isLoggedIn = userIsLoggedIn();
  console.log('AuthContext', AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoggedIn ? (
        <TouchableOpacity onPress={logOut}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={logIn}>
          <Text>Log in</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
