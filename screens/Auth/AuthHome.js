import * as React from 'react';
import { useMutation } from '@apollo/client';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import logo from '../../assets/logoLetter.png';
import themes from '../../contexts/ThemeContext';
import backgroundImage from '../../assets/backgroundGradient.png';
import AuthButton from '../../components/AuthButton';

function AuthHome({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <Text
        style={styles.welcomeHead}
      >{`Welcome, ${route.params.username}`}</Text>
      <Image source={logo} style={styles.logo} />
      <Text
        style={styles.welcomeHeadText}
      >{`Enjoy seeing photos, videos, stories & messages\nfrom your friends, family & interests around the world.`}</Text>
      <View style={styles.buttonContainer}>
        <AuthButton
          text={`Let's connect!`}
          onPress={() => {
            navigation.navigate('Login'), { email: route.params.email };
          }}
        />
      </View>
    </View>
  );
}

export default AuthHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: 200,
    width: 190,
    height: 110,
  },
  backgroundImage: {
    flex: 0.75,
  },
  login_text: {
    color: themes.blueColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  welcomeHead: {
    position: 'absolute',
    top: 190,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  welcomeHeadText: {
    position: 'absolute',
    bottom: 115,
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
  },
});
