/**
 * @class Expenses
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';

import {
  titleHeight
} from '../utils/variables';

import TopBar from './TopBar';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View>
        <TopBar title="Expenses" />

        <View style={styles.content}>
          <Text>Expenses</Text>
          <Text>All our expenses</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    marginTop: titleHeight
  }
});

export default Expenses;
