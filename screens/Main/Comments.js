import React, { useCallback, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { GET_ALLCOMMENTS } from '../../contexts/Queries';
import * as timeago from 'timeago.js';
import themes from '../../contexts/ThemeContext';
import Username from '../../components/Username';
import Loader from '../../components/Loader';
import CommentInput from '../../components/CommentInput';
import Constants from '../../components/Constants';

export default ({ route }) => {
  const { data, loading, error, refetch } = useQuery(GET_ALLCOMMENTS, {
    variables: { id: route.params?.postId },
    nextFetchPolicy: 'no-cache',
    pollInterval: 5000,
  });

  const [comments, setComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log('home fetch error', e);
    } finally {
      setRefreshing(false);
    }
  });

  const onAddComment = (newComment) => {
    setComments((i) => setComments([newComment, ...i]));
  };

  useEffect(() => {
    setComments(data?.seeFullPost?.comments);
    if (error) {
      console.log('profile e', error);
    }
  }, [data?.seeFullPost]);

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <ScrollView
        contentContainerStyle={styles.scrollWrapper}
        overScrollMode={'auto'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!loading && data?.seeFullPost && (
          <View style={styles.mainCommentContainer}>
            <View
              style={{
                ...styles.wrapper,
                borderBottomColor: themes.lightGreyColor,
                borderBottomWidth: 1,
              }}
            >
              <Image
                source={{ uri: data.seeFullPost.user.avatar }}
                style={styles.avatar}
              ></Image>
              <View style={styles.commentColumn}>
                <Text style={styles.comments}>
                  <Username username={`${data.seeFullPost.user.userName}  `} />
                  <Text style={styles.userCommentContainer}>
                    {data.seeFullPost.caption}
                  </Text>
                </Text>
                <Text style={styles.date}>
                  {timeago.format(new Date(data.seeFullPost.createdAt))}
                </Text>
              </View>
            </View>
            <View style={styles.restCommentContainer}>
              {comments?.map((comment, index) => (
                <View style={styles.wrapper} key={index}>
                  <Image
                    source={{ uri: comment.avatar }}
                    style={styles.avatar}
                  ></Image>
                  <View style={styles.commentColumn}>
                    <Text style={styles.comments}>
                      <Username username={`${comment.userName} `} />
                      <Text style={styles.userCommentContainer}>
                        {comment.text}
                      </Text>
                    </Text>
                    <Text style={styles.date}>
                      {timeago.format(new Date(comment.createdAt))}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.commentInput}>
        <CommentInput
          postId={route.params?.postId}
          setComments={(text) => onAddComment(text)}
          autoFocus={route.params?.autoFocus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollWrapper: {
    backgroundColor: 'white',
  },
  mainCommentContainer: {
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 13,
  },
  commentColumn: { flexShrink: 1 },
  comments: { flexDirection: 'row' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 7,
  },
  userCommentContainer: {
    flexGrow: 1,
    fontSize: 15,
  },
  hiddenText: {
    fontSize: 15,
    color: themes.darkGreyColor,
  },
  date: { color: themes.darkGreyColor },
  restCommentContainer: {
    flex: 1,
  },
  commentInput: {
    paddingLeft: 17,
    position: 'absolute',
    paddingVertical: 5,
    bottom: 0,
    borderTopColor: themes.lightGreyColor,
    borderTopWidth: 1,
    width: Constants.width,
    backgroundColor: 'white',
  },
});
