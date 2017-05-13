/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';

import * as firebase from 'firebase';
import Firebase from './dailydrive/firebase/init';

import Login from './dailydrive/views/Login';
import CreateAccount from './dailydrive/views/CreateAccount';
import SwitchTabs from './dailydrive/views/SwitchTabs';
import NotFound from './dailydrive/views/404';

export default class DailyDrive extends Component {
  constructor(props) {
    super(props)

    Firebase.initialise();

    this.getInitialView();

    this.state = {
      userLoaded: false,
      initialView: null
    };

    this.getInitialView = this.getInitialView.bind(this);
  }

  getInitialView() {
    firebase.auth().onAuthStateChanged((user) => {
      let initialView = user ? "switchTabs" : "Login";

      this.setState({
        userLoaded: true,
        initialView: initialView
      })
    });
  }

  static renderScene(route, navigator) {
    switch (route.name) {
      case "Login":
        return (<Login navigator={navigator} />);

      case "CreateAccount":
        return (<CreateAccount navigator={navigator} />);

      case "switchTabs":
        return (<SwitchTabs navigator={navigator} />);

      default:
        return (<NotFound />);
    }
  }

  static configureScene(route) {
    if (route.sceneConfig) {
      return (route.sceneConfig);
    } else {
      return ({
        ...NavigationExperimental.Navigator.SceneConfigs.HorizontalSwipeJump,
        gestures: {}
      });
    }
  }

  render() {
    if (this.state.userLoaded) {
      return (
        <NavigationExperimental.Navigator
          initialRoute={{name: this.state.initialView}}
          renderScene={DailyDrive.renderScene}
          configureScene={DailyDrive.configureScene}
        />);
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('DailyDrive', () => DailyDrive);
