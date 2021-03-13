import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import { View, RefreshControl, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import Loader from '../../../components/Loader';
import UserProfile from '../../../components/UserProfile';
import { GET_YOURPROFILE } from '../../../contexts/Queries';

export default ({ route, navigation }) => {
  const { loading, data, error } = useQuery(GET_YOURPROFILE, {
    variables: { userName: route.params?.username },
  });

  console.log('yourpforil', route?.params);
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
    if (error) {
      console.log('profile e', error);
    }
  }, [error]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params?.username });
  }, [route.params?.username]);

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
        {data?.seeUser && <UserProfile {...data.seeUser} />}
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
