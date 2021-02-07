import * as React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import logo from '../../assets/logoLetter.png';
import themes from '../../contexts/ThemeContext';
import AuthButton from '../../components/AuthButton';

function AuthHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <AuthButton
        text={'Creat New Account'}
        onPress={() => navigation.navigate('Signup')}
      />

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

  login_text: {
    color: themes.blueColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
