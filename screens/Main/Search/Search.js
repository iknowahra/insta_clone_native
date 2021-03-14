import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import Constants from '../../../components/Constants';
import { GET_RANDOMFEED } from '../../../contexts/Queries';
import SquarePost from '../../../components/Post/SquarePost.js';

export default () => {
  const { data: { seeRandomFeed } = [], loading, error, refetch } = useQuery(
    GET_RANDOMFEED,
    {
      nextFetchPolicy: 'no-cache',
      pollInterval: 100,
    },
  );
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
        <View style={styles.photoContainer}>
          {!loading &&
            seeRandomFeed &&
            seeRandomFeed.map((feed, index) => (
              <View
                key={index}
                style={
                  (index + 1) % 3 === 2
                    ? { marginHorizontal: 1.5, marginBottom: 1.5 }
                    : { marginBottom: 1.5 }
                }
              >
                <SquarePost
                  files={feed.files}
                  index={index}
                  posts={seeRandomFeed}
                  tabTitle="Explore"
                />
              </View>
            ))}
        </View>
      </ScrollView>
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
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photo: {
    flex: 2,
    width: (Constants.width * 33.09 * 2) / 100,
    height: (Constants.width * 33.09 * 2) / 100,
  },
});
