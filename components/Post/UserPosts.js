import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { View, StyleSheet } from 'react-native';
import { getPostsVar } from '../../contexts/LocalContext';
import FullFeeds from './FullFeeds';

export default () => {
  const posts = useReactiveVar(getPostsVar);
  return (
    <View style={styles.container}>
      <FullFeeds posts={[...posts]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
