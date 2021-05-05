import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default ({ username }) => {
  const navigation = useNavigation();
  return (
    <Text
      onPress={() =>
        navigation.navigate('YourProfile', {
          username: username.split(' ')[0],
        })
      }
      style={styles.text}
    >
      {username}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: { fontWeight: 'bold', fontSize: 17, marginRight: 5 },
});
