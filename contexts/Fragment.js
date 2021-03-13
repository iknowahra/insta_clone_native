import { gql } from '@apollo/client';

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    userName
    avatar
  }
`;

export const CORE_COMMENT_FIELDS = gql`
  fragment CoreCommentFields on Comment {
    id
    text
    userId
    userName
    avatar
    createdAt
  }
`;

export const FULL_POST_FIELDS = gql`
  fragment FullPostFields on Post {
    id
    location
    caption
    likeCount
    amILiking
    fileCount
    createdAt
    updatedAt
    commentCount
    files {
      id
      url
    }
    comments {
      ...CoreCommentFields
    }
  }
  ${CORE_COMMENT_FIELDS}
`;

export const FULL_USER_FIELDS = gql`
  fragment FullUserFields on User {
    ...CoreUserFields
    amIFollowing
    itsMe
    bio
    followersCount
    followingCount
    postCount
    fullName
    followers {
      ...CoreUserFields
    }
    following {
      ...CoreUserFields
    }
  }
  ${CORE_USER_FIELDS}
`;
