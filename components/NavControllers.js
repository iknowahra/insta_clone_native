import React, { useState, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLogginVar } from '../contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from '../navigators/AuthNavi';
import MainNavigation from '../navigators/MainNavi';

export default ({ isLoggedIn }) => {
  const [isLogin, setLogin] = useState(false);
  const checkUserLogin = false;
  //useReactiveVar(isLogginVar);
  return (
    <NavigationContainer>
      {isLogin || checkUserLogin ? <MainNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
};
