import React, { useEffect, useState, useCallback } from 'react';
import { View, RefreshControl, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import UserProfile from '../../../components/UserProfile';
import { GET_MYPROFILE } from '../../../contexts/Queries';

export default () => {
  const { loading, data, error, refetch } = useQuery(GET_MYPROFILE);
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

  useEffect(() => {
    refetch();
    if (error) {
      console.log('profile e', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode={'auto'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data?.myProfile && <UserProfile {...data.myProfile} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
