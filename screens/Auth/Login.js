import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Facebook from 'expo-facebook';

import { LOG_IN, LOG_IN_FB } from './Queries';
import { getUserId, isLogginVar } from '../../contexts/AuthContext';
import themes from '../../contexts/ThemeContext';
import logo from '../../assets/logoLetter.png';
import fbLogo from '../../assets/facebookBlue.png';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import Constants from '../../components/Constants';

export default ({ navigation, route }) => {
  const email = (route.params && route.params.email) || '';
  const [loading, setLoading] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [fbUser, setFbUser] = useState('');
  const [loginEmailMutation] = useMutation(LOG_IN);
  const [loginFbMutation] = useMutation(LOG_IN_FB);

  const preLoad = async () => {
    const fbToken = await AsyncStorage.getItem('FBtoken');
    const fbUserInfo = await AsyncStorage.getItem('FBUserInfo');
    if (fbUserInfo) {
      const { name } = JSON.parse(fbUserInfo);
      setFbUser(name);
    }
    if (fbToken) {
      setLogin(true);
    }
  };

  const onhandleSubmit = async (values) => {
    try {
      setLoading(true);
      const {
        data: { loginEmail },
      } = await loginEmailMutation({
        variables: { email: values.email, password: values.password },
      });
      if (loginEmail) {
        if (loginEmail.error) {
          if (loginEmail.error === 'There is no user.') {
            Alert.alert("There's no user", 'Do you want to sign up?', [
              {
                text: 'Sign up',
                onPress: () =>
                  navigation.navigate('Signup', { email: values.email }),
              },
              { text: 'Try again', style: 'cancel' },
            ]);
          } else {
            Alert.alert(loginEmail.error);
          }
        } else {
          await AsyncStorage.setItem('token', loginEmail.token);
          getUserId(loginEmail.user.id);
          if (!loginEmail.user.confirmSecret) {
            Alert.alert(
              'Validate Email Addresses',
              'Once you need to validate your email address',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    navigation.navigate('Confirm', { email: values.email }),
                },
              ],
            );
          } else {
            setLogin(!!(await AsyncStorage.getItem('token')));
            await AsyncStorage.setItem('isLoggedIn', 'true');
          }
        }
      }
    } catch (e) {
      console.log('Login page', e);
      Alert.alert('Unknown error happens', 'Please try to log in again.');
    } finally {
      setLoading(false);
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

          if (loginFb.error) {
            Alert.alert('Error', loginFb.error);
          } else {
            await AsyncStorage.setItem('token', loginFb.token);
            await AsyncStorage.setItem('isLoggedIn', 'true');
            getUserId(loginFb.user.id);
            setFbLogin(true);
          }
        }
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  useEffect(() => {
    if (isLogin) {
      isLogginVar(true);
    }
  }, [isLogin]);

  useEffect(() => {
    preLoad();
  }, []);

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email, password: '' }}
        onSubmit={(values) => onhandleSubmit(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <View style={styles.logoContainer}>
                  <Image source={logo} style={styles.logo} />
                </View>

                <View>
                  <AuthInput
                    name="email"
                    placeholder="Email Address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    autoCorrect={false}
                  />

                  <AuthInput
                    name="password"
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                    onSubmitEditing={handleSubmit}
                    returnKeyType="send"
                    autoCorrect={false}
                  />
                </View>

                <Pressable onPress={() => navigation.navigate('LostPassword')}>
                  <Text style={styles.lostPasswordText}>
                    Did you forget your password?
                  </Text>
                </Pressable>
                <AuthButton
                  onPress={handleSubmit}
                  text="Log In"
                  loading={loading}
                  disabled={!isValid}
                />
                <View style={styles.border}>
                  <Text style={styles.borderText}>OR</Text>
                </View>
                <Pressable style={styles.loginFb} onPress={fbLogin}>
                  <Image source={fbLogo} style={styles.fbLogo} />
                  <Text style={styles.signupFooterPressableText}>
                    {fbUser ? `Continue with ${fbUser}` : `Login with Facebook`}
                  </Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </Formik>
      <View style={styles.signupFooter}>
        <View style={styles.signupFooterContainer}>
          <Text style={styles.signupFooterText}>
            You don't have an account yet?
          </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupFooterPressableText}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 50,
    marginBottom: 40,
  },
  innerContainer: {
    marginTop: 100,
    justifyContent: 'center',
  },
  lostPasswordText: {
    color: themes.blueColor,
    textAlign: 'right',
    marginVertical: 5,
    fontSize: 13,
  },
  loginFb: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fbLogo: {
    width: 15,
    height: 15,
    marginTop: 2,
  },
  border: {
    position: 'relative',
    marginVertical: 20,
    alignContent: 'center',
    justifyContent: 'center',
    borderTopColor: themes.lightGreyColor,
    borderTopWidth: 0.8,
  },
  borderText: {
    backgroundColor: 'white',
    top: -13,
    left: Constants.width / 3,
    width: 80,
    color: themes.darkGreyColor,
    fontSize: 15,
    textAlign: 'center',
  },
  signupFooter: {
    borderTopWidth: 0.8,
    position: 'relative',
    bottom: -130,
    borderTopColor: themes.lightGreyColor,
    width: Constants.width,
  },
  signupFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  signupFooterText: {
    color: themes.darkGreyColor,
  },
  signupFooterPressableText: {
    color: themes.blueColor,
    marginLeft: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(1, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});
