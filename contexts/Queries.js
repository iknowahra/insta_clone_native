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
        friends {
          ...CoreUserFields
        }
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
  query seeFeed {
    seeFeed {
      ...FullPostFields
      user {
        ...CoreUserFields
      }
    }
  }
  ${CORE_USER_FIELDS}
  ${FULL_POST_FIELDS}
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

export const GET_RANDOMFEED = gql`
  query seeRandomFeed {
    seeRandomFeed {
      ...FullPostFields
      comments {
        ...CoreCommentFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
  ${CORE_USER_FIELDS}
  ${CORE_COMMENT_FIELDS}
  ${FULL_POST_FIELDS}
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: Int!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      ...CoreCommentFields
    }
  }
  ${CORE_COMMENT_FIELDS}
`;

export const FOLLOW_USER = gql`
  mutation followUser($id: Int!) {
    followUser(id: $id)
  }
`;
export const UNFOLLOW_USER = gql`
  mutation unfollowUser($id: Int!) {
    unfollowUser(id: $id)
  }
`;

export const UPLOAD_PHOTO = gql`
  mutation uploadPost($caption: String, $location: String, $files: String!) {
    uploadPost(caption: $caption, location: $location, files: $files) {
      ok
      error
      post {
        ...FullPostFields
        user {
          ...CoreUserFields
        }
      }
    }
  }
  ${FULL_POST_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const GET_MYROOMS = gql`
  query seeRooms {
    seeRooms {
      id
      participants {
        ...CoreUserFields
      }
      messages {
        id
        text
        createdAt
      }
      createdAt
    }
  }
  ${CORE_USER_FIELDS}
`;

export const SUB_MESSAGE = gql`
  subscription newMessage($roomId: Int!) {
    newMessage(roomId: $roomId) {
      id
      text
      createdAt
      user {
        id
        userName
        avatar
      }
    }
  }
`;

export const GET_MESSAGE = gql`
  query getMessage($roomId: Int!) {
    getMessage(roomId: $roomId) {
      id
      text
      createdAt
      user {
        id
        userName
        avatar
        itsMe
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: Int!, $text: String!) {
    sendMessage(roomId: $roomId, text: $text) {
      id
      text
      createdAt
      user {
        id
        userName
        avatar
      }
    }
  }
`;

export const SEARCH_ROOM = gql`
  query searchRoom($term: String!) {
    searchRoom(term: $term) {
      id
      participants {
        ...CoreUserFields
      }
      messages {
        id
        text
        createdAt
      }
      createdAt
    }
  }
  ${CORE_USER_FIELDS}
`;

export const MAKE_ROOM = gql`
  mutation makeRoom($toIds: [Int!]!, $name: String) {
    makeRoom(toIds: $toIds, name: $name) {
      ok
      duplication
      error
      room {
        id
        createdAt
        participants {
          ...CoreUserFields
        }
        messages {
          id
          text
          createdAt
        }
      }
    }
  }
  ${CORE_USER_FIELDS}
`;
