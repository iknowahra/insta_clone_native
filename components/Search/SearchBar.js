import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import UseInput from '../UseInput';
import themes from '../../contexts/ThemeContext';
import constants from '../Constants';

const SearchBar = ({ onNavigate, size }) => {
  const [value, onChangeText] = useState('');

  const onSubmit = async () => {
    onChangeText('');
    onNavigate(value);
  };

  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row-reverse',
        left: -8,
      }}
    >
      <UseInput
        numberOfLines={1}
        style={!size ? styles.textInput : { ...styles.textInput, width: size }}
        placeholder="Search"
        autoCapitalize={'none'}
        returnKeyType={'search'}
        placeholderTextColor={themes.darkGreyColor}
        underlineColorAndroid="transparent"
        onChangeText={(text) => onChangeText(text)}
        value={value}
        onSubmitEditing={onSubmit}
      />
      <View style={{ position: 'relative', top: 10, left: -25 }}>
        <FontAwesome name="search" size={18} color={themes.darkGreyColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: constants.width / 1.1,
    paddingLeft: 30,
    paddingVertical: 5,
    backgroundColor: themes.veryLightGreyColor,
    fontSize: 15,
    borderRadius: 7,
  },
});

export default SearchBar;
