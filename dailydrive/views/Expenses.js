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
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
  width,
  CURRENT_DATE,
  titleHeight
} from '../utils/variables';
import {
  text,
  white,
  textMute,
  listBorder,
  inputBorder
} from '../utils/colors';
import DismissKeyboard from 'dismissKeyboard';
import moment from 'moment';

import * as firebase from "firebase";
import Database from '../firebase/database';

import TopBar from './TopBar';
import Alert from './Alert';
import AddExpenseIcon from '../assets/images/header_bar_icons/add_expense.png';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      adding: false,
      working: true,
      message: {},
      amount: "",
      details: "",
      dailyExpenses: []
    };

    Database.getUserExpenses().on('value', snapshot => {
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
    this.deleteExpense = this.deleteExpense.bind(this);
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
      details: "",
      message: {}
    })
  }

  async addExpense() {
    if (!this.state.amount || !this.state.details) {
      this.setState({
        message: {
          text: 'Enter amount and details',
          type: 'error'
        }
      });
      return;
    }

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

  deleteExpense(expenseId) {
    try {
      Database.deleteExpense(this.state.user.uid, expenseId)
    }
    catch(error) {
      console.log('delete error: ', error)
    }
  }

  populateExpenses() {
    if (this.state.working) { return; }

    const expenses = this.state.dailyExpenses;

    if (!this.state.working && expenses.length) {
      return (
        expenses.map((expense, $index) => {
          return (
            <TouchableOpacity
              onLongPress={() => AlertIOS.alert(
                'Delete Expense',
                `Are you sure you want to delete your expense of NGN ${expense.amount}?`,
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Delete',
                    onPress: () => this.deleteExpense(expense.expenseId),
                    style: 'destructive'
                  }
                ])}
              key={$index}>
              <View style={styles.expenseBox}>
                <Text style={styles.currency}>NGN</Text>
                <Text style={styles.amount}>{expense.amount}</Text>
                <Text style={styles.subText}>{expense.details}</Text>

                <View style={styles.timeBox}>
                  <Text style={styles.subText}>{moment(expense.createdAt).calendar()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })
      )
    }
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

          <View>
            { this.state.adding ?
              <View>
                <Alert message={this.state.message} />

                <TextInput
                  style={styles.textInput}
                  onChangeText={(amount) => this.setState({amount})}
                  value={this.state.amount}
                  autoCapitalize="none"
                  placeholder="Amounts"
                  keyboardType="numeric"
                  onKeyPress={() => this.setState({message: {}})}
                />

                <TextInput
                  style={styles.textInput}
                  onChangeText={(details) => this.setState({details})}
                  value={this.state.details}
                  autoCapitalize="sentences"
                  placeholder="Details"
                  keyboardType="default"
                  returnKeyType="done"
                  onKeyPress={() => this.setState({message: {}})}
                />
              </View> : null
            }
          </View>

          <View style={styles.expensesContainer}>
            {this.populateExpenses()}
          </View>

          { !this.state.working && !this.state.dailyExpenses.length ?
            <View>
              <Text style={styles.noExpense}>You have no expenses today!</Text>
            </View> : null
          }

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
  expensesContainer: {
    alignItems: 'flex-start',
    borderTopColor: listBorder,
    borderTopWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 5,
  },
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
  },
  noExpense: {
    color: textMute,
    marginTop: 20,
    textAlign: 'center'
  },
  expenseBox: {
    backgroundColor: white,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    borderWidth: 0.5,
    margin: 5,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    width: (width - 30)/2
  },
  currency: {
    color: text,
    fontSize: 20,
    textAlign: 'center'
  },
  amount: {
    color: text,
    fontSize: 30,
    marginBottom: 5,
    textAlign: 'center'
  },
  timeBox: {
    borderTopColor: 'rgba(0,0,0,0.15)',
    borderTopWidth: 0.5,
    marginTop: 6,
    paddingTop: 6
  },
  subText: {
    color: text,
    fontSize: 13,
    opacity: 0.8,
    textAlign: 'center'
  }
});

export default Expenses;
