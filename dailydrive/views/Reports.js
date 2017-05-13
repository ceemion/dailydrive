/**
 * @class Reports
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

class Reports extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View>
        <TopBar title="Reports" />

        <View style={styles.content}>
          <Text>Reports</Text>
          <Text>All our reports</Text>
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

export default Reports;
