import React, { useState, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLogginVar } from '../contexts/LocalContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavi';
import MainNavigation from './MainNavi';

export default ({ isLoggedIn }) => {
  const checkUserLogin = useReactiveVar(isLogginVar);
  return (
    <NavigationContainer>
      {isLoggedIn || checkUserLogin ? <MainNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
};
