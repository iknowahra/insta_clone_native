import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import UseInput from './UseInput';

const AuthInput = ({
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onEndEditing = () => null,
  autoCorrect = true,
}) => {
  const [value, onChangeText] = useState('');
  return (
    <View style={styles.container}>
      <UseInput
        keyboardType={keyboardType}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        value={value}
        onEndEditing={onEndEditing}
        autoCorrect={autoCorrect}
        returnKeyType={returnKeyType}
        onChangeText={(text) => onChangeText(text)}
      />
    </View>
  );
};

AuthInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  onEndEditing: PropTypes.func,
  autoCorrect: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
  ]),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
});

export default AuthInput;
