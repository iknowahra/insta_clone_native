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

export const GET_POSTS = gql`
  query getPosts {
    getPosts @client
  }
`;

export const GET_SELECTED_PHOTOS = gql`
  query getSelectedPhotos {
    getSelectedPhotos @client
  }
`;

export const SEND_PHOTOS = gql`
  query sendPhotos {
    sendPhotos @client
  }
`;

export const GET_USER_NAME = gql`
  query getUserName {
    getUserName @client
  }
`;

export const isLogginVar = makeVar(false);

export const getPostsVar = makeVar([]);

export const getSelectedPhotosVar = makeVar([]);

export const sendPhotosVar = makeVar({});

export const getUserNameVar = makeVar('');
