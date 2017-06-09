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
      refreshing: false,
      reportId: null,
      tasksCount: 0,
      tasksCompleted: 0,
      totalExpenses: 0,
      reports: []
    };

    Database.getAllReports().on('value', snapshot => {
      const reports = snapshot.val();
      let array = [];

      if (reports) {
        let keys = Object.keys(reports);

        for (const key of keys) {
          let r = reports[key];
          r.taskId = key;
          array.push(r)
        }
      }

      this.setState({
        working: false,
        reports: array
      })
    })

    this.reportShell = this.reportShell.bind(this);
  }

  componentDidMount() {
    this.reportToday();
    this.computeReport();
  }

  _onRefresh = () => {
    this.computeReport();
  }

  computeReport = () => {
    this.tasksLogic();
    this.expensesLogic();
    this.updateReports();
  }

  reportToday = () => {
    Database.getUserReport().once('value')
      .then(snapshot => {
        const report = snapshot.val();

        if (report) {
          const key = Object.keys(report)[0];

          this.setState({
            reportId: key
          })
        }
        else {
          Database.saveReport()
        }
      })
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

  updateReports = () => {
    const state = this.state;
    const id = state.reportId;
    const reportData = {
      tasksCount: state.tasksCount,
      tasksCompleted: state.tasksCompleted,
      totalExpenses: state.totalExpenses,
    }

    if (id) {
      Database.updateReport(id, reportData)
    }
  }

  reportShell(index, day, count, complete, expenses) {
    let tasksView = '';

    if (!count) {
      tasksView = 'NO'
    } else {
      tasksView = `${complete} of ${count}`
    }

    return (
      <View key={index}>
        <Text>{day}</Text>
        <Text>{tasksView}</Text>
        <Text>tasks {!count ? 'logged' : 'completed'}</Text>
        <Text>NGN {expenses ? expenses : 0}</Text>
        <Text>spent</Text>
      </View>
    )
  }

  render() {
    let allReports = this.state.reports.slice().map((r, $i) => {
      return (
        this.reportShell(
          $i,
          moment(r.createdAt).format('Do'),
          r.tasksCount,
          r.tasksCompleted,
          r.totalExpenses
          )
      )
    });

    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <TopBar
          title="Reports"
        />

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              tintColor={primary}
            />
          }>
          <Text style={styles.currentMoment}>{moment().format('MMMM YYYY')}</Text>

          <View style={styles.reportsContainer}>
            {allReports}
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
