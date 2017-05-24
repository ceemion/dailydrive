/**
 * @class Login
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Button,
    TextInput,
    ScrollView,
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
  lightGrey,
  buttonText,
  containerBg,
  inputBorder
} from '../utils/colors';
import DismissKeyboard from "dismissKeyboard";
import MeldenIcon from '../assets/images/dailydrive.png';
import * as firebase from "firebase";
import Alert from './Alert';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: "",
        password: "",
        responseType: "",
        response: "",
        animating: false
    };

    this._renderButtonText = this._renderButtonText.bind(this);
    this.login = this.login.bind(this);
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

    return (<Text style={styles.buttonText}>Login</Text>)
  }

  async login() {
    DismissKeyboard();
    this.setState({
      animating: true,
      responseType: 'busy',
      response: 'Just a moment...'
    })

    try {
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);

      this.setState({
        animating: false,
        responseType: 'success',
        response: "Welcome back!"
      });

      setTimeout(() => {
        this.props.navigator.push({
          name: "switchTabs"
        })
      }, 500);
    }
    catch(error) {
      this.setState({
        animating: false,
        responseType: error.toString().split(':')[0],
        response: error.message
      })
    }
  }

  createAccount() {
    this.props.navigator.push({
      name: "CreateAccount"
    })
  }

  render() {
    return (
      <View style={styles.container} onPress={() => {DismissKeyboard()}}>
        <ScrollView>
          <View style={styles.iconContainer}>
            <Text style={styles.mainIcon}>
              <Image source={MeldenIcon} />
            </Text>
          </View>
        
          <View style={styles.form}>
            <Alert message={{type: this.state.responseType, text: this.state.response}} />

            <TextInput
              style={styles.textInput}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              autoCapitalize="none"
              placeholder="email address"
              keyboardType="email-address"
              spellCheck={false}
              returnKeyType="next"
              enablesReturnKeyAutomatically={true}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              autoCapitalize="none"
              placeholder="password"
              password={true}
              returnKeyType="done"
              enablesReturnKeyAutomatically={true}
            />

            <View>
              <TouchableOpacity onPress={this.login}>
                <View style={styles.button}>
                  {this._renderButtonText()}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signatureContainer}>
            <Text style={styles.signature}>
              powered by <Text style={{color: primary}}>Kompila</Text>
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity onPress={this.createAccount}>
          <View style={styles.getStarted}>
            <Text style={styles.getStartedText}>
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: containerBg,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  iconContainer: {
    flexGrow: 0,
    marginTop: 60
  },
  mainIcon: {
    textAlign: 'center'
  },
  form: {
    flexGrow: 1,
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
  signatureContainer: {
    flexGrow: 10
  },
  signature: {
    color: textMute,
    fontSize: 12,
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center'
  },
  getStarted: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: primary,
    flexGrow: 3,
    height: 60,
    justifyContent: 'center'
  },
  getStartedText: {
    color: lightGrey,
    fontSize: 20
  }
});

export default Login;
