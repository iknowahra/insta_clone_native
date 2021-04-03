import React, {
  useLayoutEffect,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import { getUserNameVar } from '../../contexts/LocalContext';
import { GET_MYPROFILE, GET_MYROOMS } from '../../contexts/Queries';
import SearchBar from '../../components/Search/SearchBar';
import Constants from '../../components/Constants';
import NoAvatar from '../../contexts/NoAvatar';
import ThemeContext from '../../contexts/ThemeContext';
import * as timeago from 'timeago.js';
import { Entypo } from '@expo/vector-icons';

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [onClear, setOnClear] = useState(true);
  const userName = useReactiveVar(getUserNameVar);
  const [getUserName, { data: userData }] = useLazyQuery(GET_MYPROFILE);
  const [getMyRooms, { data: roomsData, refetch }] = useLazyQuery(GET_MYROOMS, {
    fetchPolicy: 'network-only',
    pollInterval: 300,
  });

  if (!userName) {
    getUserName();
    getUserNameVar(userData?.myProfile?.user.userName);
  }

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log('Messages fetch error', e);
    } finally {
      setRefreshing(false);
    }
  });

  useEffect(() => {
    getMyRooms();
  }, []);

  useEffect(() => {
    if (roomsData) {
      setRooms(roomsData.seeRooms);
    }
  }, [roomsData]);

  useFocusEffect(
    useCallback(() => {
      async function onRefetch() {
        await refetch();
        setOnClear(true);
      }
      onRefetch();
      return () => {
        setOnClear(false);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View style={{ flexDirection: 'row' }}>
          <HeaderBackButton
            style={styles.buttonClose}
            onPress={() => {
              navigation.navigate('Messages');
            }}
          />
          <Text style={styles.titleText}>{userName}</Text>
        </View>
        <Pressable
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate('Invite', { userName })}
        >
          <Entypo name="new-message" size={24} color="black" />
        </Pressable>
      </View>
      <Pressable style={styles.searchBar}>
        <SearchBar
          onChange={(term) => {
            const currentTerm = term;
            navigation.navigate('SearchRoom', {
              term: currentTerm,
              userName,
              onFocus: true,
            });
          }}
          onClear={onClear}
        />
      </Pressable>
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode={'auto'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.mainContainer}>
          {rooms.map((room, index) => {
            let filteredUsers = room.participants.filter(
              (user) => user.userName !== userName,
            );
            return (
              <Pressable
                key={room.id}
                style={styles.roomContainer}
                onPress={() =>
                  navigation.navigate('Message', {
                    roomId: room.id,
                    userNumber: filteredUsers.length,
                    roomname:
                      room.name ||
                      filteredUsers.map((user) => user.userName).join(', '),
                    roomAvatars: JSON.stringify(
                      filteredUsers.map((user) => user.avatar),
                    ),
                    roomInfo: !room.messages.length
                      ? room.createdAt
                      : room.messages[0].createdAt,
                    currentUser: userName,
                  })
                }
              >
                <View style={styles.avatarWrapper}>
                  {filteredUsers?.length === 1 && (
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: filteredUsers[0]?.avatar || NoAvatar }}
                        style={styles.avatar}
                      />
                      {!room.messages.length && (
                        <Text style={styles.newBadge}>{'New!'}</Text>
                      )}
                    </View>
                  )}
                  {filteredUsers?.length > 1 && (
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: filteredUsers[0]?.avatar || NoAvatar }}
                        style={styles.avatarMulti}
                      />
                      <Image
                        source={{ uri: filteredUsers[1]?.avatar || NoAvatar }}
                        style={{
                          ...styles.avatarMulti,
                          top: 18,
                          left: -40,
                          borderColor: 'white',
                          borderWidth: 2,
                          marginBottom: 15,
                        }}
                      />
                      {!room.messages.length && (
                        <Text style={styles.newBadge}>{'New!'}</Text>
                      )}
                    </View>
                  )}
                  <View style={styles.roomnameInfo}>
                    <Text numberOfLines={1} style={styles.roomname}>
                      {room.name ||
                        filteredUsers.map((user) => user.userName).join(', ')}
                    </Text>
                    {!room.messages.length && (
                      <Text numberOfLines={1} style={styles.roomInfoText}>
                        {`recent action : ${timeago.format(
                          new Date(room.createdAt),
                        )}`}
                      </Text>
                    )}
                    {!!room.messages.length && (
                      <View style={{ flexDirection: 'row' }}>
                        <Text numberOfLines={1} style={styles.roomInfoText}>
                          {room.messages[0].text}
                        </Text>
                        <Text
                          style={styles.roomInfoText}
                        >{`   ∙ ${timeago.format(
                          new Date(room.messages[0].createdAt),
                        )}`}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 5,
  },
  title: {
    flexDirection: 'row',
    width: Constants.width,
    height: 50,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingRight: 15,
  },
  buttonClose: { fontSize: 20 },
  titleText: {
    textAlignVertical: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchBar: {
    width: Constants.width,
    marginLeft: -10,
  },
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
    borderColor: ThemeContext.lightGreyColor,
    borderWidth: 1,
  },
  avatarWrapper: {
    flexDirection: 'row',
  },

  avatarContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: 80,
    height: 76,
    alignItems: 'center',
  },
  avatarMulti: {
    width: 55,
    height: 55,
    borderRadius: 50,
    borderColor: ThemeContext.lightGreyColor,
    borderWidth: 1,
  },
  roomContainer: {
    flexDirection: 'row',
  },
  roomname: {
    fontWeight: 'bold',
  },
  roomnameInfo: {
    justifyContent: 'center',
  },
  roomInfoText: {
    color: ThemeContext.charcolGreyColor,
  },
  newBadge: {
    position: 'absolute',
    bottom: -3,
    right: -10,
    backgroundColor: ThemeContext.blueColor,
    color: 'white',
    width: 45,
    textAlign: 'center',
    paddingVertical: 3,
    borderRadius: 13,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
