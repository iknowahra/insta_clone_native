import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

function AuthHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Auth Home</Text>
      <Button
        title={'Go to Login'}
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title={'Go to Signup'}
        onPress={() => navigation.navigate('Signup')}
      />
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
});
