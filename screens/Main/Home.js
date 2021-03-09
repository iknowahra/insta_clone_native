import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Loader from '../../components/Loader';
import { useQuery, gql } from '@apollo/client';
import Feed from '../../components/Feed';

const FEED_QUERY = gql`
  {
    seeFeed {
      id
      location
      caption
      likeCount
      amILiking
      createdAt
      commentCount
      files {
        id
        url
      }
      comments {
        id
        text
        userId
        userName
        avatar
      }
      user {
        id
        userName
        avatar
      }
    }
  }
`;

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(FEED_QUERY);
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
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      overScrollMode={'auto'}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading && <Loader />}
      {!loading &&
        data &&
        data.seeFeed &&
        data.seeFeed.map((post) => {
          return (
            <View style={styles.innerContainer} key={post.id + post.createdAt}>
              <Feed
                id={post.id}
                location={post.location}
                caption={post.caption}
                user={post.user}
                files={post.files}
                likeCount={post.likeCount}
                amILiking={post.amILiking}
                comments={post.comments}
                createdAt={post.createdAt}
                commentCount={post.commentCount}
              />
            </View>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerContainer: { flex: 1, marginBottom: 20 },
});
