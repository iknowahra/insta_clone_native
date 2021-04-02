//subsciption 안됨
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Constants from '../../components/Constants';
import themes from '../../contexts/ThemeContext';
import NoAvatar from '../../contexts/NoAvatar';
import Header from '../../components/Message/Header';
import ChatInput from '../../components/Message/ChatInput';
import { useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGE, SUB_MESSAGE } from '../../contexts/Queries';
import * as timeago from 'timeago.js';

export default ({ route, navigation }) => {
  const scrollViewRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { roomId, roomname, userNumber, roomInfo, currentUser } = route?.params;
  const roomAvatars = JSON.parse(route.params?.roomAvatars);
  const { data, loading } = useQuery(GET_MESSAGE, {
    variables: { roomId },
    fetchPolicy: 'network-only',
  });

  const { data: subData, loading: subLoading, error } = useSubscription(
    SUB_MESSAGE,
    {
      variables: { roomId },
    },
  );

  useEffect(() => {
    if (data) {
      setMessages(data.getMessage);
    }
  }, [data, loading]);

  useEffect(() => {
    if (subData) {
      const newMessage = subData.newMessage;
      const itsMe = newMessage.user.userName === currentUser;
      newMessage.user.itsMe = itsMe;
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [subData, subLoading]);

  return (
    <View style={styles.container}>
      <Header
        roomname={roomname}
        roomAvatars={roomAvatars}
        userNumber={userNumber}
        roomInfo={roomInfo}
      />
      <View style={{ flex: 0.9 }}>
        <ScrollView
          contentContainerStyle={{
            margin: 10,
            paddingBottom: 10,
            justifyContent: 'flex-end',
          }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: false })
          }
          onLayout={() =>
            scrollViewRef.current.scrollToEnd({ animated: false })
          }
          overScrollMode={'auto'}
        >
          <View style={styles.mainContainer}>
            <View style={styles.avatarWrapper}>
              {userNumber === 1 && (
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: roomAvatars[0] || NoAvatar }}
                    style={styles.avatar}
                  />
                  <Text style={styles.username}>{roomname}</Text>
                  <Text
                    style={styles.profile}
                    onPress={() =>
                      navigation.navigate('YourProfile', { username: roomname })
                    }
                  >
                    See profile
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.messageContainer}>
              {!loading &&
                messages?.map((message) => (
                  <View
                    key={message.id}
                    style={
                      message.user.itsMe
                        ? {
                            alignSelf: 'flex-end',
                            marginBottom: 8,
                            flexDirection: 'row',
                          }
                        : styles.message
                    }
                  >
                    {!message.user.itsMe && (
                      <Image
                        source={{ uri: message.user.avatar || NoAvatar }}
                        style={styles.smAvatar}
                      />
                    )}
                    <View
                      style={
                        message.user.itsMe
                          ? styles.myMessageContainer
                          : styles.yourMessageContainer
                      }
                    >
                      <Text
                        style={
                          message.user.itsMe
                            ? styles.myMessage
                            : styles.yourMessage
                        }
                      >
                        {message.text}
                      </Text>
                      <View style={styles.date}>
                        <Text style={styles.dateText}>
                          {timeago.format(new Date(message.createdAt))}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <ChatInput roomId={roomId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0.9,
    borderColor: themes.borderGreyColor,
  },
  username: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 6,
  },
  profile: {
    borderWidth: 0.8,
    borderRadius: 4,
    borderColor: themes.borderGreyColor,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  smAvatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  mainContainer: {
    justifyContent: 'space-between',
    minHeight: Constants.height / 1.5,
  },
  messageContainer: {},
  message: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  myMessage: {
    borderRadius: 30,
    backgroundColor: themes.lightGreyColor,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    maxWidth: Constants.width / 1.4,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  yourMessage: {
    borderColor: themes.lightGreyColor,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    marginLeft: 10,
    maxWidth: Constants.width / 1.4,
  },
  yourMessageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  dateText: {
    color: themes.charcolGreyColor,
    opacity: 0.6,
    fontSize: 10,
    textAlignVertical: 'bottom',
  },
  date: { marginLeft: 15, marginRight: 10 },
});
