import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useLazyQuery } from '@apollo/client';
import UseInput from './UseInput';
import themes from '../contexts/ThemeContext';
import constants from './Constants';

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
const SearchBar = () => {
  const [value, onChangeText] = useState('');
  const [getSearchUsers, { data: userData }] = useLazyQuery(SEARCH_USER);
  const [getSearchPosts, { data: postData }] = useLazyQuery(SEARCH_POST);
  const navigation = useNavigation();

  const onSubmit = async () => {
    if (value[0] !== '#') {
      getSearchUsers({
        skip: value === undefined,
        variables: { term: value },
      });
    } else {
      getSearchPosts({
        skip: value === undefined,
        variables: { term: value.slice(1) },
      });
    }
    navigation.navigate('Result', { term: value });
  };

  return (
    <View>
      <UseInput
        numberOfLines={1}
        style={styles.textInput}
        placeholder="🔍 Search"
        autoCapitalize={'none'}
        returnKeyType={'search'}
        placeholderTextColor={themes.darkGreyColor}
        underlineColorAndroid="transparent"
        onChangeText={(text) => onChangeText(text)}
        value={value}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: constants.width / 1.1,
    paddingLeft: 15,
    paddingVertical: 5,
    backgroundColor: themes.lightGreyColor,
    borderRadius: 4,
  },
});

export default SearchBar;
