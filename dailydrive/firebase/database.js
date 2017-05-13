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

  static listenForUserTasks() {
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
}

export default Database;
