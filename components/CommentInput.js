import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from './Constants';
import UseInput from './UseInput';
import themes from '../contexts/ThemeContext';
import NoAvatar from '../assets/default-avatar.png';
import { ADD_COMMENT } from '../contexts/Queries';
import { useMutation } from '@apollo/client';

export default ({ postId, setComments, autoFocus }) => {
  const [value, onChangeText] = useState('');
  const [currentUser, setUser] = useState({});
  const [MutationComment, { data, loading, error }] = useMutation(ADD_COMMENT);
  const getUserProfile = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    setUser(user);
  };

  const onSubmit = async () => {
    await MutationComment({
      variables: {
        postId,
        text: value,
      },
      skip: value === '',
    });
    setComments({
      avatar: currentUser.avatar,
      userName: currentUser.userName,
      createdAt: new Date(),
      id: 'new',
      text: value,
    });
    onChangeText('');
  };

  useEffect(() => {
    const onUserload = async () => await getUserProfile();
    onUserload();

    if (error) {
      console.log('commentInput error', error);
    }
  }, []);

  return (
    <View>
      <View style={styles.emojiRow}>
        {['♥️', '🙌', '🔥', '👏', '😢', '🥰', '😂', '🤩'].map(
          (emoji, index) => (
            <View key={index}>
              <Text
                style={styles.emoji}
                onPress={() => onChangeText((i) => i + emoji)}
              >
                {emoji}
              </Text>
            </View>
          ),
        )}
      </View>
      <View style={styles.InputRow}>
        <Image
          source={currentUser?.avatar ? { uri: currentUser?.avatar } : NoAvatar}
          style={styles.commentAvatar}
        />
        <View style={styles.container}>
          <UseInput
            autoFocus={autoFocus}
            style={styles.textInput}
            placeholder="Add comment..."
            autoCapitalize={'none'}
            value={value}
            autoCorrect={false}
            returnKeyType="done"
            underlineColorAndroid="transparent"
            onChangeText={(text) => onChangeText(text)}
            onSubmitEditing={onSubmit}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: Constants.width / 1.25,
    padding: 7,
    paddingLeft: 18,
    borderWidth: 1,
    borderColor: themes.borderGreyColor,
    borderRadius: 20,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 7,
  },
  InputRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  emojiRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingRight: 25,
    marginBottom: 5,
  },
  emoji: {
    fontSize: 25,
  },
});
