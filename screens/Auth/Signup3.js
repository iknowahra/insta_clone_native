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
  const { email, username } = route.params;
  const onhandleSubmit = async (values) => {
    try {
      setLoading(true);
      navigation.navigate('SignupOpt', {
        email,
        username,
        firstName: values.firstName,
        lastName: values.lastName,
      });
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
          firstName: '',
          lastName: '',
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
                    name="firstName"
                    placeholder="Firstname"
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="send"
                    autoCorrect={false}
                  />

                  <AuthInput
                    name="lastName"
                    placeholder="Lastname"
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="send"
                    autoCorrect={false}
                  />
                  <Text style={styles.error}>
                    {errors.firstName && `***  ${errors.firstName}`}
                    {errors.firstName && '\n'}
                    {errors.lastName && `***  ${errors.lastName}`}
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
  firstName: yup
    .string()
    .matches(/^[a-z_-]{2,8}$/, 'Wrong Firstname. Please write again.'),
  lastName: yup
    .string()
    .matches(/^[a-z_-]{2,8}$/, 'Wrong Lastname. Please write again.'),
});
