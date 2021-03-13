import { gql } from '@apollo/client';
import {
  FULL_USER_FIELDS,
  FULL_POST_FIELDS,
  CORE_USER_FIELDS,
  CORE_COMMENT_FIELDS,
} from '../contexts/Fragment';

export const GET_MYPROFILE = gql`
  query myProfile {
    myProfile {
      user {
        ...FullUserFields
      }
      posts {
        ...FullPostFields
        user {
          ...CoreUserFields
        }
      }
    }
  }
  ${FULL_USER_FIELDS}
  ${FULL_POST_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const FEED_QUERY = gql`
  ${CORE_USER_FIELDS}
  ${FULL_POST_FIELDS}
  query seeFeed {
    seeFeed {
      ...FullPostFields
      user {
        ...CoreUserFields
      }
    }
  }
`;

export const SEARCH_USER = gql`
  query searchUser($term: String!) {
    searchUser(term: $term) {
      ...CoreUserFields
      amIFollowing
      itsMe
      bio
      followers {
        ...CoreUserFields
      }
      following {
        ...CoreUserFields
      }
    }
  }
  ${CORE_USER_FIELDS}
`;

export const SEARCH_POST = gql`
  query searchPost($term: String!) {
    searchPost(term: $term) {
      ...FullPostFields
      user {
        ...CoreUserFields
      }
    }
  }
  ${CORE_USER_FIELDS}
  ${FULL_POST_FIELDS}
`;

export const GET_YOURPROFILE = gql`
  query seeUser($userName: String!) {
    seeUser(userName: $userName) {
      user {
        ...FullUserFields
      }
      posts {
        ...FullPostFields
        user {
          ...CoreUserFields
        }
      }
    }
  }
  ${FULL_USER_FIELDS}
  ${FULL_POST_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const GET_ALLCOMMENTS = gql`
  query seeFullPost($id: Int!) {
    seeFullPost(id: $id) {
      id
      caption
      createdAt
      user {
        userName
        avatar
      }
      comments {
        ...CoreCommentFields
      }
    }
  }
  ${CORE_COMMENT_FIELDS}
`;
