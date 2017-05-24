/**
 * @class Expenses
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    AlertIOS,
    TextInput,
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
  white,
  textMute,
  inputBorder
} from '../utils/colors';
import DismissKeyboard from 'dismissKeyboard';

import TopBar from './TopBar';
import AddExpenseIcon from '../assets/images/header_bar_icons/add_expense.png';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      working: false,
      amount: "",
      details: ""
    };

    this.toggleExpenseForm = this.toggleExpenseForm.bind(this);
    this.addExpense = this.addExpense.bind(this);
  }

  toggleExpenseForm() {
    this.setState({
      adding: !this.state.adding,
      amount: "",
      details: ""
    })
  }

  addExpense() {
    console.log(this.state)
    this.setState({adding: false})
  }

  render() {
    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <TopBar
          title="Expenses"
          left={true}
          leftText={this.state.adding ? 'Cancel' : null}
          leftOnPress={this.toggleExpenseForm}
          right={true}
          rightText={this.state.adding ? 'Done' : null}
          rightIcon={!this.state.adding ? AddExpenseIcon : null}
          rightOnPress={this.state.adding ? this.addExpense : this.toggleExpenseForm}
        />

        <ScrollView style={styles.content}>
          <Text style={styles.currentDate}>Today: {CURRENT_DATE}</Text>

          <View style={styles.expensesContainer}>
            { this.state.adding ?
              <View>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(amount) => this.setState({amount})}
                  value={this.state.amount}
                  autoCapitalize="none"
                  placeholder="Amounts"
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.textInput}
                  onChangeText={(details) => this.setState({details})}
                  value={this.state.details}
                  autoCapitalize="sentences"
                  placeholder="Details"
                  keyboardType="default"
                  returnKeyType="done"
                />
              </View> : null
            }
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
  },
  textInput: {
    backgroundColor: white,
    borderColor: inputBorder,
    borderWidth: 1,
    height: 40,
    marginBottom: 25,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    textAlign: 'center'
  }
});

export default Expenses;
