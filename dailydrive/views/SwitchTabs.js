/**
 * @class SwitchTabs
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    TabBarIOS,
    StyleSheet
} from 'react-native';
import {
  tabBar,
  tabUnselected,
  tabSelected
} from '../utils/colors';

import Tasks from './Tasks';
import Expenses from './Expenses';
import Reports from './Reports';
import Profile from './Profile';

import TasksIcon from '../assets/images/tab_bar_icons/30 - iPhone Tasks.png';
import TasksIconSelected from '../assets/images/tab_bar_icons/30 - iPhone Tasks Selected.png';
import ProfileIcon from '../assets/images/tab_bar_icons/30 - iPhone Profile.png';
import ProfileIconSelected from '../assets/images/tab_bar_icons/30 - iPhone Profile Selected.png';
import ExpensesIcon from '../assets/images/tab_bar_icons/30 - iPhone Expenses.png';
import ExpensesIconSelected from '../assets/images/tab_bar_icons/30 - iPhone Expenses Selected.png';
import ReportsIcon from '../assets/images/tab_bar_icons/30 - iPhone Reports.png';
import ReportsIconSelected from '../assets/images/tab_bar_icons/30 - iPhone Reports Selected.png';

class SwitchTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'tasksTab'
    };
  }

  render() {
    return (
      <TabBarIOS
        barTintColor={tabBar}
        unselectedTintColor={tabUnselected}
        tintColor={tabSelected}
        unselectedItemTintColor={tabUnselected}>
        <TabBarIOS.Item
          title="Tasks"
          icon={TasksIcon}
          selectedIcon={TasksIconSelected}
          selected={this.state.selectedTab === 'tasksTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'tasksTab'
            })
          }}>
          <Tasks navigator={this.props.navigator} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="Expenses"
          icon={ExpensesIcon}
          selectedIcon={ExpensesIconSelected}
          selected={this.state.selectedTab === 'expensesTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'expensesTab'
            })
          }}>
          <Expenses navigator={this.props.navigator} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="Reports"
          icon={ReportsIcon}
          selectedIcon={ReportsIconSelected}
          selected={this.state.selectedTab === 'reportsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'reportsTab'
            })
          }}>
          <Reports navigator={this.props.navigator} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="Profile"
          icon={ProfileIcon}
          selectedIcon={ProfileIconSelected}
          selected={this.state.selectedTab === 'profileTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'profileTab'
            })
          }}>
          <Profile navigator={this.props.navigator} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({});

export default SwitchTabs;
