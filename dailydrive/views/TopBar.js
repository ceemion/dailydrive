/**
 * @class TopBar
 */

import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
  primary,
  topBar,
  topBorder
} from '../utils/colors';
import leftIcon from '../assets/images/header_bar_icons/left_icon.png';

let width = Dimensions.get('window').width;

class TopBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      left: this.props.left,
      right: this.props.right
    }

    this._renderLeftNav = this._renderLeftNav.bind(this);
    this._renderRightNav = this._renderRightNav.bind(this);
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    left: PropTypes.bool,
    leftText: PropTypes.string,
    navigator: PropTypes.object,
    right: PropTypes.bool,
    rightIcon: PropTypes.number,
    rightText: PropTypes.string,
    rightOnPress: PropTypes.func
  }

  _renderLeftNav() {
    if (this.state.left) {
      return (
        <TouchableOpacity onPress={() => this.props.navigator.pop()}>
          <View style={styles.leftContainer}>
            <Image style={styles.leftIcon} source={leftIcon} />
            { this.props.leftText ?
                <Text style={styles.leftText}>{this.props.leftText}</Text>
              : null }
          </View>
        </TouchableOpacity>
      )
    }
  }

  _renderRightNav() {
    if (this.state.right) {
      return (
        <TouchableOpacity onPress={() => this.props.rightOnPress()}>
          <View style={styles.rightContainer}>
            { this.props.rightText ?
                <Text style={styles.rightText}>{this.props.rightText}</Text>
              : null }

            { this.props.rightIcon ?
                <Image style={styles.rightIcon} source={this.props.rightIcon} />
              : null }
          </View>
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderLeftNav()}

        <View style={styles.title}>
          <Text style={styles.text}>
            {this.props.title}
          </Text>
        </View>

        {this._renderRightNav()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: topBar,
    borderBottomWidth: 0.5,
    borderColor: topBorder,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingTop: 10
  },
  title: {
    flexGrow: 2,
    zIndex: -1
  },
  text: {
    fontSize: 17,
    textAlign: 'center'
  },
  leftContainer: {
    flexDirection: 'row',
    flexGrow: 0,
    position: 'absolute',
    left: 8,
    top: -10
  },
  leftIcon: {
    height: 20,
    marginRight: 5,
    width: 12
  },
  leftText: {
    color: primary
  },
  rightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 0,
    position: 'absolute',
    right: 8,
    bottom: -14
  },
  rightIcon: {
    height: 27,
    marginLeft: 5,
    width: 27
  },
  rightText: {
    color: primary
  }
});

export default TopBar;
