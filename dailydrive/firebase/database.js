/**
 * @class Database
 */

import * as firebase from 'firebase';
import moment from 'moment';
import { TODAY, NOW } from '../utils/variables';

class Database {
  /**
   * Sets the name of a registered user
   * @param userId
   * @param name
   * @param email
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */

  static setsUserData(userId, name, email) {
    const userPath = `users/${userId}`;

    return firebase.database().ref(userPath).set({
      name: name,
      email: email
    });
  }

  static updateUserData(userId, data) {
    const userPath = `users/${userId}`;

    return firebase.database().ref(userPath).update(data);
  }

  /**
   * Creates a task for a registered user
   * @param user
   * @param title
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */

  static createTask(user, title) {
    const taskData = {
      owner: user.displayName,
      uid: user.uid,
      title: title,
      status: 'pending',
      createdAt: NOW
    }

    let newTaskKey = firebase.database().ref().child('tasks').push().key;
    let updates = {};

    updates[`/tasks/${TODAY}/${newTaskKey}`] = taskData;
    updates[`/user-tasks/${TODAY}/${user.uid}/${newTaskKey}`] = taskData;

    return firebase.database().ref().update(updates);
  }

  static getUserTasks() {
    const userId = firebase.auth().currentUser.uid;
    return firebase.database().ref(`/user-tasks/${TODAY}/${userId}`);
  }

  static removeTask(userId, taskId) {
    const taskPath = `/tasks/${TODAY}/${taskId}`;
    const userTaskPath = `/user-tasks/${TODAY}/${userId}/${taskId}`;

    firebase.database().ref(taskPath).remove();
    firebase.database().ref(userTaskPath).remove();
  }

  static completeTask(userId, taskId) {
    const taskPath = `/tasks/${TODAY}/${taskId}`;
    const userTaskPath = `/user-tasks/${TODAY}/${userId}/${taskId}`;
    const payload = {
      status: 'completed',
      completedAt: NOW
    }

    firebase.database().ref(taskPath).update(payload)
    firebase.database().ref(userTaskPath).update(payload)
  }

  /**
   * Adds an expense for a registered user
   * @param user
   * @param data
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */

  static addExpense(user, data) {
    const expenseData = {
      owner: user.displayName,
      uid: user.uid,
      amount: data.amount,
      details: data.details,
      createdAt: NOW
    }

    let newExpenseKey = firebase.database().ref().child('expenses').push().key;
    let updates = {};

    updates[`/expenses/${TODAY}/${newExpenseKey}`] = expenseData;
    updates[`/user-expenses/${TODAY}/${user.uid}/${newExpenseKey}`] = expenseData;

    return firebase.database().ref().update(updates);
  }

  static getUserExpenses() {
    const userId = firebase.auth().currentUser.uid;
    return firebase.database().ref(`/user-expenses/${TODAY}/${userId}`);
  }

  static deleteExpense(userId, expenseId) {
    const expensesPath = `/expenses/${TODAY}/${expenseId}`;
    const userExpensesPath = `/user-expenses/${TODAY}/${userId}/${expenseId}`;

    firebase.database().ref(expensesPath).remove();
    firebase.database().ref(userExpensesPath).remove();
  }

  /**
   * Get report for a registered user
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */

  static getUserReport() {
    const userId = firebase.auth().currentUser.uid;
    return firebase.database().ref(`/user-reports/${TODAY}/${userId}`).orderByChild('uid').equalTo(userId);
  }

  /**
   * Updates report for a registered user
   * @param user
   * @param data
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */

  // static createOrUpdateReport(user, data) {
  //   let report = null,
  //       reportKey = null,
  //       updates = {},
  //       structure = {};

  //   this.getUserReport().on('value', snapshot => {
  //     // debugger;
  //     if (snapshot.val()) {
  //       let keys = Object.keys(snapshot.val());
        
  //       for (const key of keys) {
  //         reportKey = key;
  //         report = snapshot.val()[key];
  //       }

  //       let newTaskCount = report.tasksCount + 1;

  //       const reportPath = `/reports/${TODAY}/${reportKey}`;
  //       const userReportPath = `/user-reports/${TODAY}/${user.uid}/${reportKey}`;
        
  //       console.log('our report ', reportKey)
  //       structure = {
  //         tasksCount: newTaskCount
  //       }

  //       firebase.database().ref(reportPath).update(structure)
  //       firebase.database().ref(userReportPath).update(structure)

  //     }
  //     else {
  //       structure = {
  //         owner: user.displayName,
  //         uid: user.uid,
  //         totalExpenses: data.amount || 0,
  //         tasksCount: 0, // check this
  //         tasksCompleted: 0,
  //         createdAt: NOW,
  //         updatedAt: NOW
  //       };

  //       reportKey = firebase.database().ref().child('reports').push().key;

  //       updates[`/reports/${TODAY}/${reportKey}`] = structure;
  //       updates[`/user-reports/${TODAY}/${user.uid}/${reportKey}`] = structure;

  //       firebase.database().ref().update(updates);
  //     }
  //   }) 
  // }
}

export default Database;
