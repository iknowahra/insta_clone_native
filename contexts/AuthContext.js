import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  userIsLoggedIn,
  userLogIn,
  userLogOut,
});

export const AuthProvider = ({ children, isLoggedIn: isLoggedInProp }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp);
  const logUserIn = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, logUserIn, logUserOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const userIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const userLogIn = () => {
  const { logUserIn } = useContext(AuthContext);
  return logUserIn;
};

export const userLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  return logUserOut;
};
