import React, { useState, useCallback } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import Username from '../../components/Username';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import themes from '../../contexts/ThemeContext';
import Constants from '../../components/Constants';
import SquarePost from '../../components/SquarePost.js';
import SearchHeader from '../../components/SearchHeader';

export const SEARCH_USER = gql`
  query searchUser($term: String!) {
    searchUser(term: $term) {
      id
      avatar
      userName
      amIFollowing
      itsMe
      bio
      followers {
        id
        userName
        avatar
      }
      following {
        id
        userName
        avatar
      }
    }
  }
`;
export const SEARCH_POST = gql`
  query searchPost($term: String!) {
    searchPost(term: $term) {
      caption
      location
      user {
        userName
      }
      files {
        url
      }
      likeCount
      commentCount
    }
  }
`;

export default ({ route }) => {
  const { term } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchUser, setSearchMode] = useState(term[0] !== '#');
  const [
    getSearchUsers,
    { loading: userLoading, data: userData, refetch: userRefetch },
  ] = useLazyQuery(SEARCH_USER, { nextFetchPolicy: 'network-only' });
  const [
    getSearchPosts,
    { loading: postLoading, data: postData, refetch: postRefetch },
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
    onfetch(term);
  }, []);

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
          userData && userData.searchUser[0] ? (
            userData.searchUser.map((user, index) => (
              <View style={styles.userContainer} key={index}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <Image
                    source={{
                      uri:
                        'https://3znvnpy5ek52a26m01me9p1t-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/noimage_person.png',
                    }}
                    style={styles.avatar}
                  />
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
              </View>
            ))
          ) : (
            <View style={{ marginHorizontal: 15 }}>
              <Text style={styles.greySmallText}>There is no result.</Text>
            </View>
          )
        ) : !loading && postData && postData.searchPost[0] ? (
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
                <SquarePost {...post} key={index} index={index} />
              ))}
            </View>
          </View>
        ) : (
          <View style={{ marginHorizontal: 15 }}>
            <Text style={styles.greySmallText}>There is no result.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/* {!postData.searchPost.length && (
  <View>
    <Text style={styles.greySmallText}>There is no result.</Text>
  </View>
)} */

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
