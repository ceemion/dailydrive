/**
 * @class Expenses
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    dismissKeyboard,
    ActivityIndicator
} from 'react-native';
import {
  CURRENT_DATE,
  titleHeight
} from '../utils/variables';
import {
  textMute
} from '../utils/colors';
import DismissKeyboard from 'dismissKeyboard';

import TopBar from './TopBar';
import AddExpenseIcon from '../assets/images/header_bar_icons/add_expense.png';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      working: false
    };
  }

  render() {
    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <TopBar
          title="Expenses"
          right={true}
          rightIcon={AddExpenseIcon}
        />

        <ScrollView style={styles.content}>
          <Text style={styles.currentDate}>Today: {CURRENT_DATE}</Text>

          <View style={styles.expensesContainer}>
          </View>

          <View style={styles.working}>
            { this.state.working ?
                <ActivityIndicator animating={true}/> : null
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {},
  currentDate: {
    color: textMute,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  expensesContainer: {},
  working: {
    marginTop: 10
  }
});

export default Expenses;
