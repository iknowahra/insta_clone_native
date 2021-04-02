import { createHttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isLogginVar,
  getPostsVar,
  typeDefs,
  getSelectedPhotosVar,
  sendPhotosVar,
  getUserNameVar,
} from './contexts/LocalContext';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://10.0.2.2:5000/graphql',
});
const wsLink = new WebSocketLink({
  uri: 'ws://10.0.2.2:5000/subscriptions',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: AsyncStorage.getItem('token') || '',
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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

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
        getUserName: {
          read() {
            return getUserNameVar();
          },
        },
      },
    },
  },
});

export const options = {
  cache,
  link: splitLink,
  typeDefs,
};
