// there is still a t
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Image, View, StyleSheet, Text, Pressable } from 'react-native';
import Swiper from 'react-native-swiper';
import NoAvatar from '../../assets/default-avatar.png';
import constants from '../Constants';
import UserBold from '../Username';
import themes from '../../contexts/ThemeContext';
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
  const [isShort, setShort] = useState(true);
  const [numLines, setNumLines] = useState(0);
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

  const onReadMore = useCallback((e) => {
    setNumLines(e.nativeEvent.lines.length);
  }, []);

  useEffect(() => Preload(), []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={user.avatar ? { uri: user.avatar } : NoAvatar}
          style={styles.avatar}
        />
        <View style={styles.headerCaption}>
          <UserBold username={user.userName} />
          {location && (
            <Pressable style={styles.locationPressable} onPress={() => null}>
              <Text style={styles.location}>{location}</Text>
            </Pressable>
          )}
        </View>
        <Pressable style={styles.moreIcon} onPress={() => null}>
          <Feather name="more-horizontal" size={24} />
        </Pressable>
      </View>
      <View
        style={
          isShort ? styles.swiperContainerShort : styles.swiperContainerLong
        }
      >
        <Swiper
          style={styles.swiperWrapper}
          buttonWrapperStyle={{ alignItems: 'flex-start' }}
          paginationStyle={{
            alignContent: 'center',
            bottom: -30,
          }}
        >
          {files.map((file, index) => {
            let width, height;
            Image.getSize(file.url, (width, height) => {
              if (index === 0) {
                width = width;
                height = height;
                width >= height ? setShort(true) : setShort(false);
              }
            });
            return (
              <Image
                style={
                  width >= height
                    ? { ...styles.photo, height: constants.height / 2.5 }
                    : { ...styles.photo, height: constants.height / 1.8 }
                }
                key={file.id}
                source={{ uri: file.url }}
              />
            );
          })}
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
          <Pressable
            style={styles.reactionChat}
            onPress={() =>
              navigation.navigate('Comments', { postId: id, autoFocus: true })
            }
          >
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.reactionPlane} onPress={() => null}>
            <Ionicons name="paper-plane-outline" size={24} color="black" />
          </Pressable>
        </View>
        <Pressable onPress={() => null}>
          <Text style={styles.username}>{likeCount} likes</Text>
        </Pressable>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={styles.comments}
            onTextLayout={onReadMore}
            numberOfLines={2}
          >
            <UserBold username={`${user.userName} `} />
            <Text
              style={styles.userCommentContainer}
              onPress={() => navigation.navigate('Comments', { postId: id })}
            >
              {caption}
            </Text>
          </Text>
        </View>
        <View>
          {commentCount && !!(commentCount - comments.length) ? (
            <Text
              style={styles.hiddenText}
              onPress={() => navigation.navigate('Comments', { postId: id })}
            >
              {`See all ${commentCount - comments.length} comments`}
            </Text>
          ) : null}
        </View>

        {comments &&
          comments.map((comment, index) => (
            <Text key={String(index)} style={styles.comments} numberOfLines={1}>
              <UserBold username={`${comment.userName} `} />
              <Text
                style={styles.userCommentContainer}
                onPress={() => navigation.navigate('Comments', { postId: id })}
              >
                {comment.text}
              </Text>
            </Text>
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
  location: { fontSize: 13, marginTop: -2 },
  moreIcon: { position: 'absolute', right: 5 },
  swiperContainerShort: {
    maxHeight: constants.height / 2.5,
    height: constants.height / 2.5,
  },
  swiperContainerLong: {
    maxHeight: constants.height / 1.8,
    height: constants.height / 1.8,
  },
  swiperWrapper: {},
  photo: { width: constants.width },
  userReaction: { paddingHorizontal: 15 },
  reaction: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  reactionLike: { marginRight: 20, marginBottom: 2 },
  reactionChat: { marginRight: 20 },
  comments: { flexDirection: 'row', flex: 1 },
  userCommentContainer: {
    flexGrow: 1,
    fontSize: 15,
  },
  hiddenText: {
    fontSize: 15,
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
