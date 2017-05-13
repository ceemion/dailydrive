/**
 * @class Profile
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    AlertIOS,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
  text,
  white,
  error,
  primary,
  buttonText,
  containerBg,
  inputBorder
} from '../utils/colors';
import {
  titleHeight
} from '../utils/variables';

import * as firebase from "firebase";
import Database from '../firebase/database';

import TopBar from './TopBar';
import UpdateProfileIcon from '../assets/images/header_bar_icons/update_profile.png';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      name: null,
      email: null,
      animating: false
    };

    this._updateProfile = this._updateProfile.bind(this);
    this._constructImage = this._constructImage.bind(this);
    this._renderButtonText = this._renderButtonText.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    try {
      let user = await firebase.auth().currentUser;

      this.setState({
        uid: user.uid,
        email: user.email,
        name: user.displayName
      })
    } catch(error) {
      console.log(error);
    }
  }

  async _updateProfile(promptValue) {
    this.setState({
      name: promptValue
    });

    try {
      let user = await firebase.auth().currentUser;

      user.updateProfile({
        displayName: this.state.name
      });

      Database.updateUserData(user.uid, {
        name: this.state.name
      })
    }
    catch(error) {
      console.log('update error: ', error)
    }
  }

  async logout() {
    this.setState({animating: true});

    try {
      await firebase.auth().signOut();

      this.props.navigator.push({
        name: "Login"
      });

      this.setState({animating: false})
    }
    catch(error) {
      console.log(error)
      this.setState({animating: false})
    }
  }

  _constructImage(fullName) {
    return (fullName || 'M').replace(/\w\S*\s*/g, function(name){
      return `${name.charAt(0).toUpperCase()}`
    });
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

    return (<Text style={styles.buttonText}>Log Out</Text>)
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          title="Profile"
          right={true}
          rightIcon={UpdateProfileIcon}
          rightOnPress={() => AlertIOS.prompt(
            'Update Your Profile',
            this.state.name ? null : "What's your name?",
            this._updateProfile,
            'plain-text',
            this.state.name ? this.state.name : ''
            )}
        />

        <View style={styles.content}>
          <View style={styles.profileImage}>
            <Text
              style={styles.profileImageText}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.8}>
              { this._constructImage(this.state.name) }
            </Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.email}>{this.state.email}</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity onPress={this.logout}>
            <View style={styles.button}>
              {this._renderButtonText()}
            </View>
          </TouchableOpacity>
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
  content: {
    alignItems: 'center',
    marginTop: titleHeight
  },
  profileImage: {
    alignItems: 'center',
    backgroundColor: '#959ca7',
    borderRadius: 100,
    height: 200,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 34,
    width: 200
  },
  profileImageText:  {
    color: '#ffffff',
    fontSize: 100
  },
  details: {
    marginBottom: 35,
    marginTop: 4
  },
  name: {
    color: text,
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center'
  },
  email: {
    color: primary,
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
    color: error,
    fontSize: 20
  }
});

export default Profile;
