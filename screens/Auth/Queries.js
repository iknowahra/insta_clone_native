/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const LOG_IN = gql`
  mutation loginEmail($email: String!, $password: String!) {
    loginEmail(email: $email, password: $password) {
      token
      error
      user {
        confirmSecret
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation createAccount(
    $userName: String!
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    createAccount(
      userName: $userName
      password: $password
      email: $email
      firstName: $firstName
      lastName: $lastName
    ) {
      ok
      error
    }
  }
`;

export const REQUEST_SECRET = gql`
  mutation requestSecret($userName: String!, $email: String!) {
    requestSecret(userName: $userName, email: $email) {
      ok
      error
    }
  }
`;

export const CONFIRM_SECRET = gql`
  mutation confirmSecret($secret: String!, $email: String!) {
    confirmSecret(secret: $secret, email: $email) {
      ok
      error
    }
  }
`;
