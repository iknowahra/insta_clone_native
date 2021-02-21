import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Image, StyleSheet, AppRegistry, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './assets/logoLetter.png';
import { options, cache } from './Apollo';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { CachePersistor, AsyncStorageWrapper } from 'apollo3-cache-persist';
import NavController from './components/NavControllers';
const SCHEMA_VERSION = '3';
const SCHEMA_VERSION_KEY = 'apollo';

export default function App() {
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const preLoad = async () => {
    try {
      const apolloClient = new ApolloClient({
        ...options,
      });
      const persistor = new CachePersistor({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
      });
      const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
      setClient(apolloClient);
      if (currentVersion === SCHEMA_VERSION) {
        await persistor.restore();
      } else {
        await persistor.purge();
        await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      }
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (!isLoggedIn || isLoggedIn === 'false') {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    preLoad();
  }, []);

  console.log('****', isLoggedIn);
  return client ? (
    <ApolloProvider client={client}>
      <NavController isLoggedIn={isLoggedIn} />
      <StatusBar style="auto" />
    </ApolloProvider>
  ) : (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <StatusBar style="auto" />
    </View>
  );
}

AppRegistry.registerComponent('instagram', App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 90,
  },
});
