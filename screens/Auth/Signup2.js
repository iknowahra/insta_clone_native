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
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';

export default ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [checkUserValidationQuery, { data }] = useLazyQuery(CHECK_USER, {
    fetchPolicy: 'no-cache',
  });

  const onhandleSubmit = async (values) => {
    setError(false);
    try {
      setLoading(true);
      checkUserValidationQuery({
        variables: { userName: values.username },
      });
      if (data && data.checkUser) {
        const { checkUser } = data;
        if (!checkUser.ok) {
          if (checkUser.error === 'Taken') {
            Alert.alert(
              'Username is invalid',
              'This username has been taken.',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    values.userName = '';
                  },
                },
              ],
            );
          } else {
            Alert.alert('Error', 'Please try one more time.');
          }
        } else {
          setError(false);
          navigation.navigate('SignupFin', {
            email: route.params.email,
            username: values.username,
          });
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
        initialValues={{ email: route.params.email || '' }}
        onSubmit={(values) => onhandleSubmit(values)}
        onChangeText={(values) => {}}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          errors,
        }) => (
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerContainerText}>Email Signup</Text>
            </View>
            <View style={styles.guidenceContainer}>
              <Text
                style={styles.guidence}
              >{`Usernames must be no longer than 20 characters.${`\n`}Usernames can contain letters (a-z), numbers (0-9)`}</Text>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <View>
                  <AuthInput
                    name="username"
                    placeholder="Username"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    autoCorrect={false}
                  />
                  <Text style={styles.error}>
                    {errors.username && `***  ${errors.username}`}
                  </Text>
                  <AuthButton
                    onPress={handleSubmit}
                    text="NEXT"
                    loading={loading}
                    disabled={!isValid && error}
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
    marginTop: 20,
  },
  guidenceContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidence: { textAlign: 'center', opacity: 0.9, color: 'black' },
  headerContainer: {
    marginTop: 80,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: themes.darkGreyColor,
  },
  headerContainerText: { fontSize: 30, textAlign: 'center' },
  error: { color: 'red', marginLeft: 20, textAlign: 'left', opacity: 0.8 },
});

const SignupSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, ({ min }) => `Username must be at least ${min} characters`)
    .max(20, ({ max }) => `Username must be at most ${max} characters`)
    .matches(
      /^[a-z0-9_-]{3,16}$/,
      'Wrong username. Please write username again.',
    )
    .required('Username is required'),
});
