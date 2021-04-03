import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { View, StyleSheet, Pressable } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import UseInput from '../UseInput';
import themes from '../../contexts/ThemeContext';
import constants from '../Constants';
import { SEND_MESSAGE } from '../../contexts/Queries';

const ChatInput = ({ roomId }) => {
  const [value, onChangeText] = useState('');
  const [onSendMutation] = useMutation(SEND_MESSAGE);

  const onSubmit = async () => {
    try {
      await onSendMutation({
        variables: { roomId, text: value },
      });
    } catch (e) {
      console.log('ChatInput Error, ', e);
    } finally {
      onChangeText('');
    }
  };

  return (
    <View style={styles.container}>
      <UseInput
        numberOfLines={1}
        style={styles.textInput}
        placeholder="Send a message..."
        autoCapitalize={'none'}
        returnKeyType={'send'}
        placeholderTextColor={themes.darkGreyColor}
        underlineColorAndroid="transparent"
        onChangeText={(text) => onChangeText(text)}
        value={value}
        onSubmitEditing={onSubmit}
      />
      <Pressable style={styles.camera}>
        <Entypo name="camera" size={20} color="white" />
      </Pressable>
      <Pressable style={styles.photo}>
        <FontAwesome
          name="file-picture-o"
          size={20}
          color={themes.charcolGreyColor}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: constants.width,
    paddingBottom: 5,
  },
  textInput: {
    position: 'relative',
    marginLeft: 5,
    width: constants.width / 1.03,
    paddingLeft: 45,
    paddingVertical: 5,
    backgroundColor: 'white',
    fontSize: 15,
    borderRadius: 35,
    borderColor: themes.borderGreyColor,
    borderWidth: 0.8,
  },
  camera: {
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themes.blueColor,
    position: 'absolute',
    bottom: 9,
    left: 9,
  },
  photo: {
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 9,
    right: 17,
  },
});

export default ChatInput;
