/**
 * @class Reports
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    dismissKeyboard,
    ActivityIndicator
} from 'react-native';
import DismissKeyboard from "dismissKeyboard";
import {
  titleHeight
} from '../utils/variables';
import {
  primary
} from '../utils/colors';
import moment from 'moment';
import * as firebase from "firebase";
import Database from '../firebase/database';

import TopBar from './TopBar';

class Reports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      working: true,
      tasksCount: 0,
      tasksCompleted: 0,
      totalExpenses: 0
    };
  }

  componentDidMount() {
    this.computeReport()
  }

  _onRefresh = () => {
    this.computeReport();
  }

  computeReport = () => {
    this.tasksLogic();
    this.expensesLogic();
  }

  tasksLogic = () => {
    Database.getUserTasks().once('value')
      .then(snapshot => {
        const tasks = snapshot.val();

        if (tasks) {
          const keys = Object.keys(tasks);
          let tasksCompleted = 0;

          for (const key of keys) {
            let task = tasks[key];
            if (task.status === 'completed') {
              tasksCompleted++
            }
          }

          this.setState({
            tasksCount: keys.length,
            tasksCompleted: tasksCompleted
          })
        }
      })
  }

  expensesLogic = () => {
    Database.getUserExpenses().once('value')
      .then(snapshot => {
        const expenses = snapshot.val();

        if (expenses) {
          const keys = Object.keys(expenses);
          let count = 0;

          for (const key of keys) {
            let expense = expenses[key];
            count += parseInt(expense.amount);
          }

          this.setState({
            totalExpenses: count,
            working: false
          })
        }
      })
  }

  render() {
    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <TopBar
          title="Reports"
        />

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={this.state.working}
              onRefresh={this._onRefresh}
              tintColor={primary}
            />
          }>
          <Text style={styles.currentMoment}>{moment().format('MMMM YYYY')}</Text>

          <View style={styles.reportsContainer}>
            <View>
              <Text>{moment().format('Do')}</Text>
              <Text>{this.state.tasksCompleted} of {this.state.tasksCount}</Text>
              <Text>tasks completed</Text>
              <Text>NGN {this.state.totalExpenses}</Text>
              <Text>spent</Text>
            </View>
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
  currentMoment: {
    color: primary,
    marginBottom: 10,
    textAlign: 'center'
  },
  content: {},
  reportsContainer: {},
  working: {
    marginTop: 10
  },
});

export default Reports;
