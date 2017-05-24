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

import * as firebase from "firebase";
import Database from '../firebase/database';

import TopBar from './TopBar';
import AddExpenseIcon from '../assets/images/header_bar_icons/add_expense.png';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      adding: false,
      working: true,
      amount: "",
      details: "",
      dailyExpenses: []
    };

    Database.listenForUserExpenses().on('value', snapshot => {
        let arr = [];

        if (snapshot.val()) {
          let keys = Object.keys(snapshot.val());

          for (const key of keys) {
            let e = snapshot.val()[key];
            e.expenseId = key;
            arr.push(e)
          }
        }

        this.setState({
          working: false,
          dailyExpenses: arr
        })
      })

    this.toggleExpenseForm = this.toggleExpenseForm.bind(this);
    this.addExpense = this.addExpense.bind(this);
    this.populateExpenses = this.populateExpenses.bind(this);
  }

  async componentDidMount() {
    try {
      let user = await firebase.auth().currentUser;

      this.setState({
        user: user
      })
    } catch(error) {
      this.setState({
        working: false
      })
      console.log('could not retrieve user: ', error);
    }
  }

  toggleExpenseForm() {
    this.setState({
      adding: !this.state.adding,
      amount: "",
      details: ""
    })
  }

  async addExpense() {
    try {
      Database.addExpense(this.state.user, {
        amount: this.state.amount,
        details: this.state.details
      })

      this.setState({adding: false})
    }
    catch(error) {
      console.log('add expense error: ', error)
    }
  }

  populateExpenses() {
    if (this.state.working) { return; }

    const expenses = this.state.dailyExpenses;

    if (!this.state.working && expenses.length) {
      return (
        expenses.map((expense, $index) => {
          return (
            <View key={$index}>
              <Text>Amount {expense.amount}</Text>
              <Text>Details {expense.details}</Text>
              <Text>Date {expense.createdAt}</Text>
            </View>
          )
        })
      )
    }

    return (
      <View>
        <Text>No expenses today</Text>
      </View>
    )
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

          <View>
            {this.populateExpenses()}
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
