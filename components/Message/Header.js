import React from 'react';
import { HeaderBackButton } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Constants from '../../components/Constants';
import themes from '../../contexts/ThemeContext';
import NoAvatar from '../../contexts/NoAvatar';
import * as timeago from 'timeago.js';

export default ({ roomname, roomAvatars, userNumber, roomInfo }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton
          style={styles.buttonClose}
          onPress={() => navigation.navigate('Messages')}
        />
        <View style={styles.roomContainer}>
          {userNumber === 1 && (
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: roomAvatars[0] || NoAvatar }}
                style={styles.avatar}
              />
            </View>
          )}
          {userNumber > 1 && (
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: roomAvatars[0] || NoAvatar }}
                style={styles.avatarMulti}
              />
              <Image
                source={{ uri: roomAvatars[1] || NoAvatar }}
                style={{
                  ...styles.avatarMulti,
                  top: 13,
                  left: -25,
                  borderColor: 'white',
                  borderWidth: 2,
                  marginBottom: 15,
                }}
              />
            </View>
          )}

          <View style={styles.roomnameInfo}>
            <Text numberOfLines={1} style={styles.roomname}>
              {roomname}
            </Text>
            <Text numberOfLines={1} style={styles.roomInfoText}>
              {`recent action : ${timeago.format(new Date(roomInfo))}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: Constants.width,
    height: 60,
    marginTop: 20,
    alignItems: 'center',
    borderBottomColor: themes.borderGreyColor,
    borderBottomWidth: 0.4,
    backgroundColor: 'white',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  avatarContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: 55,
    height: 40,
    alignItems: 'center',
  },
  avatarMulti: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  roomContainer: {
    flexDirection: 'row',
  },
  roomname: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  roomnameInfo: {
    justifyContent: 'center',
  },
  roomInfoText: {
    color: themes.charcolGreyColor,
    fontSize: 13,
    marginTop: -3,
  },
});
