import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LOG_IN } from './Queries';
import { isLogginVar } from '../../contexts/AuthContext';
import themes from '../../contexts/ThemeContext';
import logo from '../../assets/logoLetter.png';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';

export default ({ navigation, route }) => {
  const email = (route.params && route.params.email) || '';
  const [loading, setLoading] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [loginEmailMutation] = useMutation(LOG_IN);

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

  useEffect(() => {
    if (isLogin) {
      isLogginVar(true);
    }
  }, [isLogin]);
  return (
    <View style={styles.container}>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email, password: '' }}
        onSubmit={(values) => onhandleSubmit(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingContainer}
            >
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

                  <Pressable
                    onPress={() => navigation.navigate('LostPassword')}
                  >
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
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>

      <View style={styles.signupFooter}>
        <View style={styles.signupFooterContainer}>
          <Text>You don't have an account yet?</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingContainer: { flex: 1 },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 50,
    marginBottom: 40,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  lostPasswordText: {
    color: themes.blueColor,
    textAlign: 'right',
    marginVertical: 5,
  },
  signupFooter: {
    position: 'absolute',
    bottom: 10,
  },
  signupFooterContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupFooterPressableText: { color: themes.blueColor, marginLeft: 5 },
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
