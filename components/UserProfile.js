import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import themes from '../contexts/ThemeContext';
import { FOLLOW_USER, UNFOLLOW_USER } from '../contexts/Queries';
import Constants from './Constants';
import SquarePost from './Post/SquarePost.js';
import NoAvatar from '../assets/default-avatar.png';

export default ({ user, posts }) => {
  const navigation = useNavigation();
  const [grindMode, setGrind] = useState(true);
  const [follow, setFollow] = useState(user?.amIFollowing);
  const [followUser] = useMutation(FOLLOW_USER, {
    variables: { id: user?.id },
    skip: !user?.id,
  });
  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: { id: user?.id },
    skip: !user?.id,
  });

  const onClick = () => {
    if (follow) {
      setFollow(!follow);
      unfollowUser();
    } else {
      setFollow(!follow);
      followUser();
    }
  };

  const toggleGrind = (mode) => setGrind(mode === 'grind');

  useLayoutEffect(() => {
    navigation.setOptions({ title: user.userName });
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <Image
            source={user.avatar ? { uri: user.avatar } : NoAvatar}
            style={styles.avatar}
          />

          <View style={styles.userNumberContainer}>
            <View style={styles.userNumberColumn}>
              <Text style={styles.userNumber}>{user.postCount}</Text>
              <Text style={styles.userNumberUnit}>posts</Text>
            </View>
            <View style={styles.userNumberColumn}>
              <Text style={styles.userNumber}>{user.followersCount}</Text>
              <Text style={styles.userNumberUnit}>followers</Text>
            </View>
            <View style={styles.userNumberColumn}>
              <Text style={styles.userNumber}>{user.followingCount}</Text>
              <Text style={styles.userNumberUnit}>following</Text>
            </View>
          </View>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.fullName}>{user.fullName}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={
                !user.itsMe && !follow
                  ? {
                      ...styles.lineBotton,
                      backgroundColor: themes.blueColor,
                      borderWidth: 0,
                    }
                  : { ...styles.lineBotton }
              }
              onPress={onClick}
            >
              <Text
                style={
                  !user.itsMe && !follow
                    ? { ...styles.bottonText, color: 'white' }
                    : { ...styles.bottonText, color: 'black' }
                }
              >
                {user.itsMe ? 'edit profile' : follow ? 'Unfollow' : 'follow'}
              </Text>
            </Pressable>
            <Pressable style={{ ...styles.lineBotton }} onPress={() => null}>
              <Text style={styles.bottonText}>
                {user.itsMe ? 'saved' : 'message'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.sliceBar}>
        <Pressable
          onPress={() => toggleGrind('grind')}
          style={{
            ...styles.iconGrind,
            borderBottomColor: grindMode ? 'black' : 'white',
          }}
        >
          <MaterialIcons
            name="grid-on"
            size={30}
            color={grindMode ? 'black' : themes.darkGreyColor}
          />
        </Pressable>
        <Pressable
          onPress={() => toggleGrind('portrait')}
          style={{
            ...styles.iconPortrait,
            borderBottomColor: !grindMode ? 'black' : 'white',
          }}
        >
          <MaterialIcons
            style={{ justifyContent: 'center' }}
            name="portrait"
            size={34}
            color={!grindMode ? 'black' : themes.darkGreyColor}
          />
        </Pressable>
      </View>

      {user.postCount ? (
        <View style={styles.photoContainer}>
          {posts.map((post, index) => (
            <View
              key={index}
              style={
                (index + 1) % 3 === 2
                  ? { marginHorizontal: 1.5, marginBottom: 1.5 }
                  : { marginBottom: 1.5 }
              }
            >
              <SquarePost
                posts={posts}
                {...post}
                index={index}
                tabTitle={user.userName}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noPost}>
          <Text style={styles.noPostText}>No Post</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderColor: themes.lightGreyColor,
    borderWidth: 1,
    marginRight: 30,
  },
  userNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 0.8,
  },
  userNumber: { fontWeight: 'bold', textAlign: 'center', fontSize: 19 },
  userNumberUnit: { marginTop: -5 },
  bioContainer: {},
  fullName: { fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  lineBotton: {
    width: Constants.width / 2.3,
    height: 35,
    borderColor: themes.borderGreyColor,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
  },
  bottonText: {
    color: 'black',
    textAlign: 'center',
  },
  photoContainer: {
    borderTopColor: themes.greyColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noPost: {
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noPostText: {
    textAlign: 'center',
    fontSize: 20,
  },
  sliceBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  iconGrind: {
    width: Constants.width / 2,
    paddingLeft: Constants.width / 5,
    paddingBottom: 5,

    borderBottomWidth: 1,
  },
  iconPortrait: {
    marginTop: -2.1,
    paddingBottom: 5,
    borderBottomWidth: 1,
    width: Constants.width / 2,
    paddingLeft: Constants.width / 5,
  },
});
