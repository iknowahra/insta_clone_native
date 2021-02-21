import React from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';

import themes from '../../contexts/ThemeContext';
import logo from '../../assets/logoLetterWhite.png';
import backgroundImage from '../../assets/backgroundGradient.png';
import AuthButton from '../../components/AuthButton';
import Constants from '../../components/Constants';

export default ({ navigation, route }) => {
  const email = (route.params && route.params.email) || '';
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
        <View style={styles.backgroundText}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.logoText}>
            Sign up and enjoy friends' pictures and videos
          </Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <AuthButton text="Log in facebook" onPress={() => null} />
        <View
          style={{
            ...styles.loginFooter,
            ...styles.border,
          }}
        >
          <Text style={styles.borderText}>OR</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('SignupStr', { email })}>
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
    marginBottom: 10,
  },
  backgroundImage: { flex: 0.6 },
  backgroundText: {
    position: 'absolute',
    top: 120,
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
    opacity: 0.8,
    marginLeft: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
