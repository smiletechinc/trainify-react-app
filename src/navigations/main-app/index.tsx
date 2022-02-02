/* eslint-disable arrow-parens */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {Image} from 'react-native';
// import PatientHomeContainer from '../../../screens/main-app/patient/home';
import HomeFlowStack from './home';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {COLORS} from '../../constants';

import styles from '../styles';

const Tab = createMaterialBottomTabNavigator();
const patientHomeIcon = require('../../../assets/main-app-icons/patient/patient-home-icon.png');
const diarioUnselectedIcon = require('../../../assets/main-app-icons/patient/diario-unselected.png');
const diarioSelectedIcon = require('../../../assets/main-app-icons/patient/diario-selected.png');
const patientProfileIcon = require('../../../assets/main-app-icons/patient/patient-profile-icon.png');

const PatientMainAppStack = function PatientMainAppStack() {
  const patientTabItems = [
    {
      id: 0,
      name: 'Home',
      component: HomeFlowStack,
    },
    {
      id: 1,
      name: 'Diario',
      component: DiarioFlowStack,
    },
    {
      id: 2,
      name: 'Profile',
      component: HomeFlowStack,
    },
    
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={COLORS.medium_dark_blue}
      barStyle={styles.bar_style}
      screenOptions={({route}) => ({
        title: '',
        tabBarIcon: ({focused}: {focused: boolean}) => {
          if (route.name === 'Home') {
            return (
              <Image
                source={focused ? patientHomeIcon : patientHomeIcon}
                style={styles.home_icon_size}
              />
            );
          }
          if (route.name === 'Diario') {
            return (
              <Image
                source={focused ? diarioSelectedIcon : diarioUnselectedIcon}
                style={styles.blog_icon_size}
              />
            );
          }
          if (route.name === 'Profile') {
            return (
              <Image
                source={focused ? patientProfileIcon : patientProfileIcon}
                style={styles.profile_icon_size}
              />
            );
          }
          return null;
        },
      })}
    >
      {patientTabItems.map(navigationItem => (
        <Tab.Screen
          key={navigationItem.id}
          name={navigationItem.name}
          component={navigationItem.component}
        />
      ))}
    </Tab.Navigator>
  );
};
export default PatientMainAppStack;
