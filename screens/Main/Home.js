import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Loader from '../../components/Loader';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from '../../contexts/Queries';
import FullFeeds from '../../components/Post/FullFeeds';

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(FEED_QUERY, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 50000,
  });
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
      {loading && (
        <View styles={styles.innerContainer}>
          <Loader />
        </View>
      )}
      {!loading && data?.seeFeed && <FullFeeds posts={[...data.seeFeed]} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerContainer: { flex: 1, marginBottom: 20 },
});
