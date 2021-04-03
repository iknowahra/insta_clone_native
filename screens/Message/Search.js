import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import { SEARCH_ROOM } from '../../contexts/Queries';
import SearchBar from '../../components/Search/SearchBar';
import Constants from '../../components/Constants';
import NoAvatar from '../../contexts/NoAvatar';
import themes from '../../contexts/ThemeContext';
import * as timeago from 'timeago.js';

export default ({ navigation, route }) => {
  const { term, userName, onFocus } = route.params;
  const [currentTerm, setTerm] = useState(term);
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [
    onfetch,
    { data: filterdRooms, error, refetch },
  ] = useLazyQuery(SEARCH_ROOM, {
    fetchPolicy: 'network-only',
    pollInterval: 500,
  });

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

  const liftTerm = (term) => {
    setTerm(term);
    onfetch({ variables: { term }, skip: term === '' });
  };

  useEffect(() => {
    onfetch({ variables: { term: currentTerm }, skip: term === '' });
  }, []);

  useEffect(() => {
    if (filterdRooms) {
      setRooms(filterdRooms.searchRoom);
    }
  }, [filterdRooms]);

  useFocusEffect(
    useCallback(() => {
      async function onRefetch() {
        await refetch();
        return;
      }
      onRefetch();
      return () => null;
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar
          onChange={(term) => liftTerm(term)}
          size={Constants.width / 1.2}
          initialValue={currentTerm}
          onFocus={onFocus}
          isFocused={true}
        />
        <Text
          style={styles.cancel}
          onPress={() => navigation.navigate('Messages', { term: '' })}
        >
          Cancel
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.wrapper}
          overScrollMode={'auto'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.mainContainer}>
            {!rooms.length && (
              <Text style={styles.greySmallText}>There is no result.</Text>
            )}
            {rooms.map((room) => {
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
                  {filteredUsers?.length === 1 && (
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: filteredUsers[0]?.avatar || NoAvatar }}
                        style={styles.avatar}
                      />
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
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'white',
  },
  cancel: { textAlignVertical: 'center' },
  searchBar: {
    width: Constants.width,
    flexDirection: 'row',
  },
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
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
    color: themes.charcolGreyColor,
  },
  greySmallText: {
    color: themes.darkGreyColor,
    fontSize: 15,
  },
});
