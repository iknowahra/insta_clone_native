import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Feed from './Feed';

export default ({ posts = [] }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {posts.map((post) => {
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
