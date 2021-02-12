import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import themes from '../../contexts/ThemeContext';
import logo from '../../assets/logoLetter.png';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import { useEffect } from 'react';

export default ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => console.log(values)}
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
                      placeholder="Password"
                      secureTextEntry
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
          <Text>Don't you have an account yet?</Text>
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
