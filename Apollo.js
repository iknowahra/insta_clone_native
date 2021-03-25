import { createHttpLink, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isLogginVar,
  getPostsVar,
  typeDefs,
  getSelectedPhotosVar,
  sendPhotosVar,
} from './contexts/LocalContext';
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
        getPosts: {
          read() {
            return getPostsVar();
          },
        },
        getSelectedPhotos: {
          read() {
            return getSelectedPhotosVar();
          },
        },
        sendPhotos: {
          read() {
            return sendPhotosVar();
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
