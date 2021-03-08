import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Image, View, StyleSheet, Text, Pressable } from 'react-native';
import Swiper from 'react-native-swiper';
import constants from './Constants';
import UserBold from './Username';
import themes from '../contexts/ThemeContext';
import * as timeago from 'timeago.js';

const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: Int!) {
    toggleLike(postId: $postId)
  }
`;

const Feed = ({
  id,
  caption,
  location,
  user,
  files = [],
  likeCount: likeCountProp,
  amILiking: amILikingProp,
  comments: commentsProp = [],
  createdAt,
  commentCount,
}) => {
  const navigation = useNavigation();
  const [comments, setComments] = useState(commentsProp);
  const [amILiking, setLike] = useState(amILikingProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id },
  });

  const Preload = () => {
    let result = [];
    const filtered = commentsProp.forEach((comment) => {
      if (comment.userId === user.id) {
        result.push(comment);
      }
    });
    setComments(result.slice(0, 2));
  };

  const onToggleLike = async () => {
    amILiking ? setLikeCount((p) => p - 1) : setLikeCount((p) => p + 1);
    setLike((p) => !p);
    try {
      toggleLikeMutation();
    } catch (e) {
      console.log('toggleLikeError', e);
    }
  };

  useEffect(() => Preload(), []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.headerCaption}>
          <UserBold username={user.userName} />
          <Pressable style={styles.locationPressable} onPress={() => null}>
            <Text style={styles.location}>{location}</Text>
          </Pressable>
        </View>
        <Pressable style={styles.moreIcon} onPress={() => null}>
          <Feather name="more-horizontal" size={24} />
        </Pressable>
      </View>
      <View style={styles.swiperContainer}>
        <Swiper
          style={styles.swiperWrapper}
          buttonWrapperStyle={{ alignItems: 'flex-start' }}
          paginationStyle={{
            alignContent: 'center',
            bottom: -30,
          }}
        >
          {files.map((files) => (
            <Image
              style={styles.photo}
              key={files.id}
              source={{ uri: files.url }}
            />
          ))}
        </Swiper>
      </View>
      <View style={styles.userReaction}>
        <View style={styles.reaction}>
          <Pressable style={styles.reactionLike} onPress={onToggleLike}>
            {amILiking ? (
              <Ionicons name="heart-sharp" size={28} color={themes.redColor} />
            ) : (
              <Ionicons name="heart-outline" size={28} color="black" />
            )}
          </Pressable>
          <Pressable style={styles.reactionChat} onPress={() => null}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.reactionPlane} onPress={() => null}>
            <Ionicons name="paper-plane-outline" size={24} color="black" />
          </Pressable>
        </View>
        <Pressable onPress={() => null}>
          <Text style={styles.username}>{likeCount} likes</Text>
        </Pressable>

        <View style={styles.comments}>
          <UserBold username={user.userName} />
          <Text
            numberOfLines={caption.length <= 45 ? 1 : 2}
            style={styles.userCommentContainer}
            onPress={() => navigation.navigate('Comments')}
            textBreakStrategy="highQuality"
          >
            {caption}
          </Text>
          <Text
            style={{
              ...styles.hiddenText,
              textAlignVertical: caption.length <= 45 ? 'center' : 'bottom',
            }}
          >
            more
          </Text>
        </View>
        {commentCount >= 2 ? (
          <Text
            style={styles.hiddenText}
            onPress={() => navigation.navigate('Comments')}
          >
            See
            {commentCount - comments.length === 1
              ? ` 1 comment`
              : `all of ${commentCount - comments.length} comments`}
          </Text>
        ) : !comments.length ? (
          <Text
            style={styles.hiddenText}
            onPress={() => navigation.navigate('Comments')}
          >
            See 1 comment
          </Text>
        ) : null}
        {comments &&
          comments.map((comment, index) => (
            <View key={String(index)} style={styles.comments}>
              <UserBold username={comment.userName} />
              <Text
                style={styles.userCommentContainer}
                textBreakStrategy="highQuality"
                numberOfLines={1}
              >
                {comment.text}
              </Text>
            </View>
          ))}
        <View>
          <Text style={styles.date}>{timeago.format(new Date(createdAt))}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  headerCaption: {},
  avatar: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 18 },
  location: { fontSize: 14, marginTop: -4 },
  moreIcon: { position: 'absolute', right: 5 },
  swiperContainer: {
    maxHeight: constants.height / 1.5,
    height: constants.height / 2.5,
  },
  swiperWrapper: { height: constants.height / 2.5 },
  photo: { width: constants.width, height: constants.height / 2.5 },
  userReaction: { paddingHorizontal: 15 },
  reaction: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  reactionLike: { marginRight: 20, marginBottom: 2 },
  reactionChat: { marginRight: 20 },
  comments: {
    flexDirection: 'row',
  },
  userCommentContainer: {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    fontSize: 17,
  },
  hiddenText: {
    fontSize: 17,
    color: themes.darkGreyColor,
  },
  date: { color: themes.darkGreyColor },
});

Feed.propTypes = {
  id: PropTypes.number.isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  amILiking: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired,
      userName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  createdAt: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
};

export default Feed;
