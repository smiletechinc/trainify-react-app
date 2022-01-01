import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, Platform } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { COLORS, SCREEN_WIDTH, STATUS_BAR_HEIGHT } from '../../constants';
import globalStyles from '../../global-styles';
import styles from './styles';

const signinMainImage = require('../../assets/images/signin-main-image.png');

const Authentication: FunctionComponent = ({ navigation }) => {
  return(
    <View style={styles.login_main_container}>
      <View style={{paddingHorizontal: SCREEN_WIDTH * 0.05}}>
        <TouchableOpacity
          style={styles.login_back_icon}
          onPress={() => {
            navigation.goBack();
          }}
        >

        </TouchableOpacity>
      </View>
      <View style={{marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
        <AutoHeightImage 
          source={signinMainImage}
          width={SCREEN_WIDTH * 0.9}
        />
      </View>
    </View>
  )
};
export default Authentication;
