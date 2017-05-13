/**
 * @class Tasks
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Button,
    AlertIOS,
    ScrollView,
    Dimensions,
    StyleSheet,
    dismissKeyboard,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import CheckBox from 'react-native-checkbox';
import {
  titleHeight
} from '../utils/variables';
import {
  text,
  textMute,
  listBorder
} from '../utils/colors';
import DismissKeyboard from "dismissKeyboard";
import moment from 'moment';

import * as firebase from "firebase";
import Database from '../firebase/database';

import TopBar from './TopBar';
import CreateTaskIcon from '../assets/images/header_bar_icons/create_task.png';
import RemoveTaskIcon from '../assets/images/remove_task.png';
import uncheckedIcon from '../assets/images/unchecked.png';
import checkedIcon from '../assets/images/checked.png';

let width = Dimensions.get('window').width;

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      working: true,
      dailyTasks: []
    };

    Database.listenForUserTasks().on('value', snapshot => {
        let taskArray = [];

        if (snapshot.val()) {
          let keys = Object.keys(snapshot.val());

          for (const key of keys) {
            let i = snapshot.val()[key];
            i.taskId = key;
            taskArray.push(i)
          }
        }

        this.setState({
          working: false,
          dailyTasks: taskArray
        })
      })

    this.renderTasks = this.renderTasks.bind(this);
    this.createTask = this.createTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
  }

  async componentDidMount() {
    try {
      let user = await firebase.auth().currentUser;

      this.setState({
        user: user
      })
    } catch(error) {
      console.log('could not retrieve user: ', error);
    }
  }

  renderTasks(tasks) {
    if (!this.state.working && this.state.dailyTasks.length === 0) {
      return (
        <View>
          <Text style={styles.noTask}>You're all set, no tasks at this time!</Text>
        </View>
      )
    }

    return this.state.dailyTasks.map((task, $index) => {
      let completed = task.status === 'completed';

      return (
        <View key={$index} style={styles.taskContainer}>
          <View style={styles.checkbox}>
            <CheckBox
              label={null}
              containerStyle={styles.checkboxContainer}
              checkboxStyle={styles.checkboxStyle}
              uncheckedImage={completed ? checkedIcon : uncheckedIcon}
              checkedImage={checkedIcon}
              onChange={
                (checked) => this.completeTask(completed, checked, task.taskId)
              }
            />
          </View>

          <View style={completed ? styles.titleContainerCompleted : styles.titleContainer}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text>{task.completedAt}</Text>
          </View>

          { !completed ?
            <TouchableOpacity onPress={() => this.removeTask(task.taskId)}>
              <Image source={RemoveTaskIcon} style={styles.removeTaskIcon} />
            </TouchableOpacity> : null }
        </View>
      )
    })
  }

  async createTask(promptValue) {
    try {
      Database.createTask(this.state.user, promptValue)
    }
    catch(error) {
      console.log('update error: ', error)
    }
  }

  async removeTask(taskId) {
    try {
      Database.removeTask(this.state.user.uid, taskId)
    }
    catch(error) {
      console.log('delete error: ', error)
    }
  }

  async completeTask(completed, checked, taskId) {
    if (completed) return;

    try {
      Database.completeTask(this.state.user.uid, taskId)
    }
    catch(error) {
      console.log('task complete error: ', error)
    }
  }

  render() {
    const currentDate = moment().format('dddd, MMMM Do YYYY');

    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <TopBar
          title="Tasks"
          right={true}
          rightIcon={CreateTaskIcon}
          rightOnPress={() => AlertIOS.prompt(
            'Add Task',
            null,
            this.createTask,
            'plain-text'
            )}
        />

        <ScrollView style={styles.content}>
          <Text style={styles.currentDate}>Today: {currentDate}</Text>

          <View style={styles.tasksContainer}>
            {this.renderTasks()}
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
  tasksContainer: {
    borderTopColor: listBorder,
    borderTopWidth: 0.5,
    marginLeft: 4,
    marginRight: 4
  },
  taskContainer: {
    alignItems: 'center',
    borderBottomColor: listBorder,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingBottom: 7,
    paddingTop: 7
  },
  titleContainer: {
    width: width - 70
  },
  titleContainerCompleted: {
    width: width - 40
  },
  taskTitle: {
    color: text,
    fontSize: 16
  },
  noTask: {
    color: textMute,
    marginTop: 20,
    textAlign: 'center'
  },
  working: {
    marginTop: 10
  },
  removeTaskIcon: {
    height: 25,
    marginRight: 10,
    width: 25
  },
  checkboxContainer: {
    marginBottom: 0
  },
  checkboxStyle: {
    marginRight: 0
  },
  checkbox: {
    width: 30
  }
});

export default Tasks;
