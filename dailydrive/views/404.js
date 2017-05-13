/**
 * @class 404
 * Rendered when a page is not found
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';

class NotFound extends Component {
  render() {
    return (
      <View>
        <Text>Page not found</Text>
      </View>
    )
  }
}

export default NotFound;
