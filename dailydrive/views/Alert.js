import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {
  error,
  primary,
  success,
  textMute
} from '../utils/colors';

const Alert = (props) => {
  return (
    <View style={[styles.responseBox, {borderColor: _setResponseColor(props.type)}]}>
      <Text
        style={[styles.responseText, {color: _setResponseColor(props.type)}]}>
        {props.text}
      </Text>
    </View>
  )
}

const _setResponseColor = (type) => {
    switch(type.toLocaleLowerCase()) {
      case 'success':
        return success;
      case 'error':
        return error;
      case 'busy':
        return textMute;
      default:
        return 'transparent'
    }
  }

const styles = StyleSheet.create({
  responseBox: {
    borderRadius: 5,
    borderWidth: 0.5,
    margin: 10,
    padding: 5
  },
  responseText: {
    fontSize: 12,
    textAlign: 'center'
  }
})

export default Alert;
