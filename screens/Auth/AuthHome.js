import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import logo from '../../assets/logoLetter.png';
import themes from '../../contexts/ThemeContext';
import constants from '../../components/Constants';
import { visitWithTypeInfo } from 'graphql';

function AuthHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <TouchableOpacity
        style={styles.signup}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signup_text}>Creat New Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.login_text}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AuthHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 90,
  },
  signup: {
    backgroundColor: themes.blueColor,
    width: constants.width / 2.1,
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  signup_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },

  login_text: {
    color: themes.blueColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
