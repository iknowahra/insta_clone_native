import React, { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import Tags from 'react-native-tags';
import ThemeContext from '../../contexts/ThemeContext';
import Constants from '../../components/Constants';
import { GET_MYPROFILE, GET_MYROOMS, MAKE_ROOM } from '../../contexts/Queries';
import NoAvatar from '../../assets/default-avatar.png';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default ({ navigation, route }) => {
  const { userName } = route.params;
  const tagRef = useRef();
  const [tags, setTags] = useState([]);
  const [toIds, setToIds] = useState([]);
  const { loading, data, error, refetch } = useQuery(GET_MYPROFILE, {
    fetchPolicy: 'network-only',
  });
  const [onSendMutation, { data: muatationData }] = useMutation(MAKE_ROOM);

  const onAddTag = (userName, userId) => {
    if (tags.includes(userName)) {
      const filteredName = tags.filter((tag) => tag !== userName);
      const filteredId = toIds.filter((id) => id !== userId);
      setTags(filteredName);
      setToIds(filteredId);
      tagRef.current.setState({ tags: filteredName });
    } else {
      setToIds((prev) => [...prev, userId]);
      setTags((prev) => [...prev, userName]);
      tagRef.current.setState((state) => {
        return {
          tags: [...state.tags, userName],
        };
      });
    }
  };
  const onSend = async () => {
    try {
      await onSendMutation({
        variables: { toIds },
        update(cache, { data: { makeRoom } }) {
          if (!makeRoom?.duplication) {
            const newRoomResponse = makeRoom?.room;
            const existingRooms = cache.readQuery({ query: GET_MYROOMS });
            if (existingRooms && newRoomResponse) {
              cache.writeQuery({
                query: GET_MYROOMS,
                data: {
                  seeRooms: [newRoomResponse, ...existingRooms?.seeRooms],
                },
              });
            }
          }
        },
      });
    } catch (e) {
      console.log('invite e', e);
    } finally {
      if (muatationData && muatationData?.makeRoom) {
        const { room } = muatationData?.makeRoom;
        let filteredUsers = room.participants.filter(
          (user) => user.userName !== userName,
        );

        navigation.navigate('Message', {
          roomId: room.id,
          userNumber: filteredUsers.length,
          roomname:
            room.name || filteredUsers.map((user) => user.userName).join(', '),
          roomAvatars: JSON.stringify(filteredUsers.map((user) => user.avatar)),
          roomInfo: !room.messages.length
            ? room.createdAt
            : room.messages[0].createdAt,
          currentUser: userName,
        });
      }
    }
  };

  const setClear = () => {
    setToIds([]);
    setTags([]);
    tagRef.current.setState({ tags: [] });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <HeaderBackButton
          style={styles.buttonClose}
          onPress={() => {
            setClear();
            navigation.navigate('Messages');
          }}
        />
        <Text style={styles.titleText}>New Message</Text>
        <Pressable onPress={onSend}>
          <Text
            style={
              !toIds.length
                ? {
                    color: ThemeContext.charcolGreyColor,
                    opacity: 0.7,
                  }
                : { color: 'black' }
            }
          >
            Chat
          </Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 18 }}>Receiver</Text>
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              overScrollMode="auto"
            >
              <View style={{ flex: 1 }}>
                <Tags
                  ref={tagRef}
                  textInputProps={{
                    placeholder: 'Add...',
                  }}
                  containerStyle={{
                    marginVertical: 5,
                  }}
                  onChangeTags={(tags) => setTags(tags)}
                  inputStyle={styles.inputStyle}
                  renderTag={({ tag, index, onPress }) => {
                    return (
                      <Pressable
                        key={`${tag}-${index}`}
                        onPress={onPress}
                        style={styles.tagContainerStyle}
                      >
                        <Text style={styles.tagTextStyle}>{tag}</Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
            <View style={styles.headLine}>
              <Text style={styles.normalText}>Recommendation</Text>
            </View>
            <View style={styles.users}>
              {data?.myProfile?.user?.friends?.map((user) => {
                return (
                  <Pressable
                    key={user.id}
                    style={styles.userWrapper}
                    onPress={() => onAddTag(user.userName, user.id)}
                  >
                    <View style={styles.user}>
                      <Image
                        source={user.avatar ? { uri: user.avatar } : NoAvatar}
                        style={styles.avatar}
                      />
                      <View style={styles.userText}>
                        <Text style={styles.normalText}>
                          {user.name.length > 1 ? user.name : user.userName}
                        </Text>
                        {user.name.length > 1 ? (
                          <Text style={styles.username}>{user.userName}</Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.checkBox}>
                      {tags.includes(user.userName) ? (
                        <MaterialCommunityIcons
                          name="checkbox-marked-circle"
                          size={30}
                          color={ThemeContext.blueColor}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="checkbox-blank-circle-outline"
                          size={30}
                          color={ThemeContext.borderGreyColor}
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: { flex: 1, paddingHorizontal: 5 },
  title: {
    flexDirection: 'row',
    width: Constants.width,
    height: 50,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: ThemeContext.borderGreyColor,
    borderBottomWidth: 0.4,
    backgroundColor: 'white',
    paddingRight: 15,
  },
  buttonClose: { fontSize: 20 },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: Constants.width,
    height: 80,
  },
  inputStyle: {
    backgroundColor: 'white',
  },
  headLine: {
    paddingVertical: 15,
  },
  normalText: { fontSize: 15 },
  tagContainerStyle: {
    backgroundColor: ThemeContext.blueColor,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
  },
  tagTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  username: {
    color: ThemeContext.charcolGreyColor,
    opacity: 0.6,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
    borderWidth: 0.8,
    borderColor: ThemeContext.lightGreyColor,
  },
  user: {
    flexDirection: 'row',
  },
  userText: {
    justifyContent: 'center',
  },
  userWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkBox: {
    justifyContent: 'center',
  },
});
