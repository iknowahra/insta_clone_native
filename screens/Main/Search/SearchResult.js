import React, { useState, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import Username from '../../../components/Username';
import Loader from '../../../components/Loader';
import themes from '../../../contexts/ThemeContext';
import Constants from '../../../components/Constants';
import SquarePost from '../../../components/Post/SquarePost.js.js';
import SearchHeader from '../../../components/Search/SearchHeader';
import NoAvatar from '../../../contexts/NoAvatar';
import { SEARCH_USER, SEARCH_POST } from '../../../contexts/Queries';

export default ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchUser, setSearchMode] = useState(route.params?.term[0] !== '#');
  const [
    getSearchUsers,
    { data: userData, refetch: userRefetch },
  ] = useLazyQuery(SEARCH_USER, { nextFetchPolicy: 'network-only' });
  const [
    getSearchPosts,
    { data: postData, refetch: postRefetch },
  ] = useLazyQuery(SEARCH_POST, { nextFetchPolicy: 'network-only' });

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      searchUser ? await userRefetch() : await postRefetch();
    } catch (e) {
      console.log('Result fetch error', e);
    } finally {
      setRefreshing(false);
    }
  });

  const onfetch = (value) => {
    try {
      setLoading(true);
      if (searchUser) {
        getSearchUsers({
          skip: value === undefined && value[0] === '#',
          variables: { term: value },
        });
      } else {
        getSearchPosts({
          skip: value === undefined && value[0] !== '#',
          variables: { term: value.slice(1) },
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Sorry for unexpected error. Please try again.');
      console.log('Result', e, 'search user is ', searchUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onfetch(route.params?.term);
  }, []);

  console.log(postData);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.wrapper}
        overScrollMode={'auto'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && <Loader />}
        {searchUser ? (
          userData?.searchUser[0] ? (
            userData?.searchUser?.map((user, index) => (
              <Pressable style={styles.userContainer} key={index}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <Image source={{ uri: NoAvatar }} style={styles.avatar} />
                )}
                <View style={styles.userInfoContainer}>
                  <Username username={user.userName} />
                  <Text
                    style={styles.greySmallText}
                    numberOfLines={1}
                    textBreakStrategy="highQuality"
                  >
                    {user.bio}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={{ marginHorizontal: 15 }}>
              <Text style={styles.greySmallText}>There is no result.</Text>
            </View>
          )
        ) : !loading && postData?.searchPost[0] ? (
          <View style={styles.postContainer}>
            <SearchHeader
              uri={
                postData.searchPost[0]
                  ? postData.searchPost[0].files[0].url
                  : '#'
              }
              postCount={postData.searchPost.length}
            />
            <View style={styles.photoContainer}>
              {postData.searchPost.map((post, index) => (
                <SquarePost
                  {...post}
                  key={index}
                  index={index}
                  posts={postData.searchPost}
                />
              ))}
            </View>
          </View>
        ) : (
          !loading && (
            <View style={{ marginHorizontal: 15 }}>
              <Text style={styles.greySmallText}>There is no result.</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  userContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 10,
  },
  userInfoContainer: {
    justifyContent: 'center',
    width: Constants.width / 1.5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
    padding: 1,
    borderColor: themes.lightGreyColor,
    borderWidth: 1,
  },
  greySmallText: {
    color: themes.darkGreyColor,
    fontSize: 15,
  },
  postContainer: { flex: 1 },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
