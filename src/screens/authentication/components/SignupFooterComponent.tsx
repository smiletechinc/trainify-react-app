import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
// Constants.
import { COLORS } from '../../../constants';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from '../styles';

const rightRoundedArrow = require('../../../assets/images/right-rounded-arrow.png');

const SignupFooter: FunctionComponent = ({ navigation }) => {
  return(
    <View>
      <View
        style={styles.login_forgot_view}
      >
        {/* <TouchableOpacity>
          <Text style={[globalStyles.small, globalStyles.bold]}>Remember me</Text>
        </TouchableOpacity> */}
        
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          marginTop: 29,
        }}
      >
        <TouchableOpacity
          delayPressIn={0}
          activeOpacity={0.8}
          onPress={() => {
            // onPress();
          }}
        >
          <Image source={rightRoundedArrow} style={{width: 77, height: 77}}/>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 30,
          flex: 1,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity>
          <Text>Already have an account? <Text style={{color: COLORS.medium_dark_blue}}>Signin</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

export default SignupFooter;
