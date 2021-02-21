import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Text,
  Image,
  View,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';

import themes from '../../contexts/ThemeContext';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import logo from '../../assets/logoLetter.png';
import { isLogginVar } from '../../contexts/AuthContext';
import { REQUEST_SECRET, CONFIRM_SECRET } from './Queries';

export default ({ route }) => {
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [initSend, setSent] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const [requestSecretMutation] = useMutation(REQUEST_SECRET);

  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET);

  const onsendEmail = async () => {
    try {
      setSendLoading(true);
      await requestSecretMutation({ variables: { email } });
    } catch (e) {
      Alert.alert('Error', 'Sorry. Try one more time.');
      console.log('request Email error', e);
    } finally {
      setSendLoading(false);
    }
  };
  const onhandleSubmit = async (values) => {
    console.log('ssibal', values);
    try {
      setLoading(true);
      const {
        data: { confirmSecret },
      } = await confirmSecretMutation({
        variables: {
          email,
          secret: values.secret,
        },
      });
      if (confirmSecret) {
        if (!confirmSecret.ok) {
          Alert.alert('Error', confirmSecret.error);
        } else {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          const isToken = await AsyncStorage.getItem('token');
          setLogin(!!isToken);
        }
      }
    } catch (e) {
      console.log('Login page', e);
      Alert.alert('Unknown error happens', 'Please try one more time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initSend) {
      onsendEmail();
      setSent(true);
    }
  }, []);

  useEffect(() => {
    isLogginVar(isLogin);
  }, [isLogin]);

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ secret: '' }}
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

                  <View style={styles.guideContainer}>
                    <Text style={styles.guideContainerText}>
                      {`Please check your email '${email}'.\nValidation email could be in your spambox.`}{' '}
                    </Text>
                  </View>

                  <AuthInput
                    name="secret"
                    placeholder="Please enter secret"
                    onChangeText={handleChange('secret')}
                    onBlur={handleBlur('secret')}
                    value={values.secret}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                    autoCorrect={false}
                  />
                  <Pressable onPress={onsendEmail} disabled={sendLoading}>
                    {sendLoading ? (
                      <ActivityIndicator color={themes.inactiveBlueColor} />
                    ) : (
                      <Text style={styles.guideContainerPressable}>
                        Do you want to re-send?
                      </Text>
                    )}
                  </Pressable>
                  <AuthButton
                    onPress={handleSubmit}
                    text="Confirm"
                    loading={loading}
                    disabled={!isValid}
                  />
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
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
    marginTop: 10,
    marginBottom: -20,
  },
  guideContainer: {
    margin: 15,
  },
  guideContainerText: {
    textAlign: 'center',
  },
  guideContainerPressable: {
    color: themes.blueColor,
    textAlign: 'right',
    marginVertical: 5,
  },
});

const loginValidationSchema = yup.object().shape({
  secret: yup
    .string()
    .min(5, ({ min }) => `Secret must be at least ${min} characters`)
    .required('Secret is required. Please check your email.'),
});
