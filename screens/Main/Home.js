import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  Platform,
} from 'react-native';
import Loader from '../../components/Loader';
import { useLazyQuery, useQuery } from '@apollo/client';
import { FEED_QUERY } from '../../contexts/Queries';
import FullFeeds from '../../components/Post/FullFeeds';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import themes from '../../contexts/ThemeContext';
import Constants from '../../components/Constants';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [getData, { loading, data, refetch }] = useLazyQuery(FEED_QUERY, {
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      overScrollMode={'auto'}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!loading && data && !data?.seeFeed?.length && (
        <View style={styles.noPostsContainer}>
          <Ionicons
            name={
              Platform.OS === 'ios' ? 'ios-planet-outline' : 'md-planet-outline'
            }
            size={45}
            color="black"
          />
          <Text style={styles.noPostsText}>No post yet</Text>
          <Pressable
            style={styles.noPostsButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.noPostsButtonText}>Wanna explore?</Text>
          </Pressable>
        </View>
      )}
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
  innerContainer: { marginBottom: 20 },
  noPostsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  noPostsText: { fontSize: 18 },
  noPostsButton: {
    backgroundColor: themes.blueColor,
    borderRadius: 4,
    width: Constants.width / 3,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  noPostsButtonText: { fontSize: 16, color: 'white', textAlign: 'center' },
});
