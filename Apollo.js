import { InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLogginVar, typeDefs } from './contexts/AuthContext';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLogginVar();
          },
        },
      },
    },
  },
});

export const options = {
  cache,
  uri: 'http://10.0.2.2:5000/graphql',
  headers: {
    authorization: `Bearer ${AsyncStorage.getItem('token')}`,
  },
  typeDefs,
};
