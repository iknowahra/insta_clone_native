import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Image, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';

import themes from '../../contexts/ThemeContext';
import logo from '../../assets/logoLetterWhite.png';
import fbLogo from '../../assets/facebookWhite.png';
import backgroundImage from '../../assets/backgroundGradient.png';
import AuthButton from '../../components/AuthButton';
import Constants from '../../components/Constants';
import { LOG_IN_FB, CHECK_USER } from './Queries';
import { isLogginVar } from '../../contexts/AuthContext';

export default ({ navigation, route }) => {
  const [fbUser, setFbUser] = useState('');
  const [isFbLogin, setFbLogin] = useState(false);
  const [loginFbMutation] = useMutation(LOG_IN_FB);
  const [checkUserValidationQuery, { data }] = useLazyQuery(CHECK_USER, {
    fetchPolicy: 'no-cache',
  });

  const preLoad = async () => {
    const fbToken = await AsyncStorage.getItem('FBtoken');
    const fbUserInfo = await AsyncStorage.getItem('FBUserInfo');
    if (fbUserInfo) {
      const { name } = JSON.parse(fbUserInfo);
      setFbUser(name);
    }
    if (fbToken) {
      setFbLogin(true);
    }
  };

  const onCheckNewAccount = async (email) => {
    checkUserValidationQuery({
      variables: { email },
    });
    if (data && data.checkUser) {
      const { checkUser } = data;
      if (!checkUser.ok) {
        if (checkUser.error === 'Taken') {
          return false;
        }
        console.log('checkUserError', checkUser.error);
        Alert.alert('Sorry for the Error', checkUser.error);
        return null;
      } else {
        return true;
      }
    }
  };

  const fbLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '253692292993280',
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=${token}`,
        );
        const userInfo = await response.json();
        await AsyncStorage.setItem('FBtoken', token);
        await AsyncStorage.setItem('FBUserInfo', JSON.stringify(userInfo));
        const {
          email,
          fist_name: firstName,
          id: facebookId,
          last_name: lastName,
        } = userInfo;
        const isNewUser = await onCheckNewAccount(email);
        if (isNewUser) {
          navigation.navigate('SignupMid', {
            email,
            firstName,
            lastName,
            facebookId,
          });
        } else {
          const {
            data: { loginFb },
          } = await loginFbMutation({
            variables: {
              email,
              facebookId,
            },
          });

          if (!loginFb.ok) {
            Alert.alert('Error', loginFb.error);
          } else {
            await AsyncStorage.setItem('token', loginFb.token);
            setFbLogin(true);
          }
        }
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  useEffect(() => {
    if (isFbLogin) {
      isLogginVar(true);
    }
  }, [isFbLogin]);

  useEffect(() => {
    preLoad();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
        <View style={styles.backgroundText}>
          <Image source={logo} style={styles.logo} />
          <Text
            style={styles.logoText}
          >{`Share your photos & videos all around the world.`}</Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <AuthButton
          text={fbUser ? `Continue with ${fbUser}` : `Login with Facebook`}
          image={fbLogo}
          onPress={fbLogin}
        />
        <View
          style={{
            ...styles.loginFooter,
            ...styles.border,
          }}
        >
          <Text style={styles.borderText}>OR</Text>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate('SignupStr', { email: route.params.email })
          }
        >
          <Text style={styles.PressableText}>Sign up with email</Text>
        </Pressable>
      </View>
      <View style={styles.loginFooter}>
        <View style={styles.loginFooterContainer}>
          <Text style={styles.loginFooterText}>Do you have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.PressableText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerContainer: { alignItems: 'center' },
  innerContainer: {
    position: 'relative',
    marginTop: -150,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 160,
    height: 50,
    marginBottom: 15,
  },
  backgroundImage: { flex: 0.6 },
  backgroundText: {
    position: 'absolute',
    top: 110,
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 15,
  },
  border: {
    position: 'relative',
    marginVertical: 20,
    width: Constants.width / 1.2,
    alignContent: 'center',
  },
  borderText: {
    position: 'absolute',
    backgroundColor: 'white',
    top: -13,
    left: Constants.width / 3,
    width: 80,
    color: themes.darkGreyColor,
    fontSize: 15,
    textAlign: 'center',
  },
  loginFooter: {
    borderTopWidth: 0.8,
    position: 'absolute',
    bottom: 10,
    borderTopColor: themes.lightGreyColor,
    width: Constants.width / 1,
  },
  loginFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  loginFooterText: {
    color: themes.darkGreyColor,
  },
  PressableText: {
    color: themes.blueColor,
    marginLeft: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
