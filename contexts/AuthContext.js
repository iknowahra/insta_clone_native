import { makeVar, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const isLogginVar = makeVar(false);
