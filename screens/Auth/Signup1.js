import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useLazyQuery } from '@apollo/client';

import { CHECK_USER } from './Queries';
import themes from '../../contexts/ThemeContext';
import AuthButton from '../../components/Auth/AuthButton';
import AuthInput from '../../components/Auth/AuthInput';

export default ({ navigation, route }) => {
  const email = route.params?.email;
  const [loading, setLoading] = useState(false);
  const [checkUserValidationQuery, { data }] = useLazyQuery(CHECK_USER, {
    fetchPolicy: 'no-cache',
  });

  const onhandleSubmit = async (values) => {
    try {
      setLoading(true);
      checkUserValidationQuery({
        variables: { email: values.email },
      });
      if (data && data.checkUser) {
        const { checkUser } = data;
        if (!checkUser.ok) {
          if (checkUser.error === 'Taken') {
            Alert.alert(
              'This email has been already used',
              'Do you want to log in?',
              [
                {
                  text: 'Log in',
                  onPress: () =>
                    navigation.navigate('Login', { email: values.email }),
                },
                { text: 'OK', style: 'cancel' },
              ],
            );
          } else {
            Alert.alert('Unknown error happens', 'Please try to log in again.');
          }
        } else {
          navigation.navigate('SignupMid', { email: values.email });
        }
      }
    } catch (e) {
      console.log('Signup page', e);
      Alert.alert('Unknown error happens', 'Please try to log in again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={SignupSchema}
        initialValues={{ email }}
        onSubmit={(values) => onhandleSubmit(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerContainerText}>Email Signup</Text>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
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

                  <AuthButton
                    onPress={handleSubmit}
                    text="NEXT"
                    loading={loading}
                    disabled={!isValid}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
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
  },
  innerContainer: {
    marginTop: 50,
  },
  headerContainer: {
    marginTop: 100,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: themes.darkGreyColor,
  },
  headerContainerText: { fontSize: 30, textAlign: 'center' },
});

const SignupSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
});
