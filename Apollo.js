import { createHttpLink, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isLogginVar,
  getUserId,
  getUserName,
  typeDefs,
} from './contexts/AuthContext';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://10.0.2.2:5000/graphql',
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLogginVar();
          },
        },
        getUserId: {
          read() {
            return getUserId();
          },
        },
        getUserName: {
          read() {
            return getUserName();
          },
        },
      },
    },
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const options = {
  cache,
  link: authLink.concat(httpLink),
  typeDefs,
};
