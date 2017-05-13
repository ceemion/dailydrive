/**
 * @class CreateAccount
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TextInput,
    StyleSheet,
    dismissKeyboard,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
  white,
  error,
  primary,
  success,
  textMute,
  buttonText,
  containerBg,
  inputBorder
} from '../utils/colors';
import {
  titleHeight
} from '../utils/variables';
import DismissKeyboard from "dismissKeyboard";
import TopBar from './TopBar';
import * as firebase from "firebase";
import Database from '../firebase/database';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      responseType: "",
      response: "",
      animating: false
    };

    this._renderButtonText = this._renderButtonText.bind(this);
    this._setResponseColor = this._setResponseColor.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  _renderButtonText() {
    if (this.state.animating) {
      return (
        <ActivityIndicator
          animating={true}
          color="black"
        />
      )
    }

    return (<Text style={styles.buttonText}>Create account</Text>)
  }

  _setResponseColor() {
    switch(this.state.responseType.toLocaleLowerCase()) {
      case 'success':
        return success;
      case 'error':
        return error;
      case 'busy':
        return textMute;
      default:
        return 'transparent'
    }
  }

  async createAccount() {
    DismissKeyboard();
    this.setState({
      animating: true,
      responseType: 'busy',
      response: 'Creating your Melden account...'
    })

    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
      let user = await firebase.auth().currentUser;

      user.updateProfile({
        displayName: this.state.name
      });

      Database.setsUserData(user.uid, this.state.name, this.state.email)

      this.setState({
        animating: false,
        responseType: 'success',
        response: "Account created"
      });

      this.props.navigator.push({
        name: "switchTabs"
      })
    }
    catch(error) {
      this.setState({
        animating: false,
        responseType: error.toString().split(':')[0],
        response: error.message
      })
    }
  }

  render() {
    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <TopBar
          title="Create Account"
          left={true}
          leftText="Login"
          navigator={this.props.navigator}
        />

        <View style={styles.form}>
          <View style={[styles.responseBox, {borderColor: this._setResponseColor()}]}>
            <Text
              style={[styles.responseText, {color: this._setResponseColor()}]}>
              {this.state.response}
            </Text>
          </View>

          <TextInput
            style={styles.textInput}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            autoCapitalize="words"
            placeholder="name"
            autoFocus={true}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            autoCapitalize="none"
            placeholder="email address"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            autoCapitalize="none"
            placeholder="password"
            password={true}
          />

          <View>
            <TouchableOpacity onPress={this.createAccount}>
              <View style={styles.button}>
                {this._renderButtonText()}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.signature}>
            powered by <Text style={{color: primary}}>Kompila</Text>
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: containerBg,
    flex: 1
  },
  form: {
    marginTop: titleHeight
  },
  responseBox: {
    borderRadius: 50,
    borderWidth: 0.5,
    margin: 10,
    padding: 5
  },
  responseText: {
    fontSize: 12,
    textAlign: 'center'
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
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: white,
    borderColor: inputBorder,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 57,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  buttonText: {
    color: buttonText,
    fontSize: 20
  },
  signature: {
    color: textMute,
    fontSize: 12,
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center'
  }
});

export default CreateAccount;
