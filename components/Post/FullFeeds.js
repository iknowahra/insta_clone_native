import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Feed from './Feed';

export default ({ posts = [] }) => {
  return (
    <View style={styles.wrapper}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  container: {},
  innerContainer: { flex: 1, marginBottom: 20 },
});
