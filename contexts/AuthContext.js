import { makeVar, gql } from '@apollo/client';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    getUserId: Int!
  }
`;

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const USER_ID = gql`
  query getUserId {
    getUserId @client
  }
`;

export const USERNAME = gql`
  query getUserName {
    getUserName @client
  }
`;

export const isLogginVar = makeVar(false);

export const getUserId = makeVar(null);

export const getUserName = makeVar(null);
