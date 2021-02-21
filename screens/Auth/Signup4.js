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
  const { email, username, firstName, lastName } = route.params;
  const [loading, setLoading] = useState(false);
  const [checkUserValidationQuery, { data }] = useLazyQuery(CHECK_USER, {
    fetchPolicy: 'no-cache',
  });

  const onhandleSubmit = async (values) => {
    try {
      setLoading(true);
      //작성해야함
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
        initialValues={{
          password: '',
          passwordConfirm: '',
        }}
        onSubmit={(values) => onhandleSubmit(values)}
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <View>
                  <AuthInput
                    name="password"
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                    onSubmitEditing={handleSubmit}
                    autoCorrect={false}
                  />
                  <AuthInput
                    name="passwordConfirm"
                    placeholder="Password confirm"
                    onChangeText={handleChange('passwordConfirm')}
                    onBlur={handleBlur('passwordConfirm')}
                    value={values.passwordConfirm}
                    secureTextEntry
                    onSubmitEditing={handleSubmit}
                    returnKeyType="send"
                    autoCorrect={false}
                  />
                  <Text style={styles.error}>
                    {errors.password && `***  ${errors.password}`}
                    {errors.password && '\n'}
                    {errors.passwordConfirm && `***  ${errors.passwordConfirm}`}
                  </Text>
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
    marginTop: 20,
  },
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
  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .required('Password is Required!'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], "Password's not match")
    .required('Password confirm is Required!'),
});
