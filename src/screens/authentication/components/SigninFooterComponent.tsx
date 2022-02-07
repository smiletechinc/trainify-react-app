import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';

// Constants.
import { COLORS } from '../../../constants';


// Custom Styles
import globalStyles from '../../../global-styles';
import styles from '../styles';

import { PrimaryButton } from './../../../components/buttons';

const rightRoundedArrow = require('../../../assets/images/right-rounded-arrow.png');

type Props = {
  proceedToLogin: any;
  signupScreenOnPress: any;
  forgorPasswordOnPress: any;
}

const SigninFooter: FunctionComponent = (props) => {
  const {proceedToLogin, signupScreenOnPress,forgorPasswordOnPress} = props;

  return(
    <View>
      <View
        style={styles.login_forgot_view}
      >
        <TouchableOpacity>
          <Text style={[globalStyles.small, globalStyles.bold]}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{
            forgorPasswordOnPress();
          }}
        >
          <Text style={[globalStyles.small, globalStyles.bold]}>Forgot password</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          marginTop: 29,
        }}
      >
        {/* <TouchableOpacity
          delayPressIn={0}
          activeOpacity={0.8}
          onPress={() => {
            props.signupScreenOnPress();
          }}
        >
          <Image source={rightRoundedArrow} style={{width: 77, height: 77}}/>
        </TouchableOpacity> */}

      <View style={{width:'100%'}}>
        <PrimaryButton title='Sign In' onPress={proceedToLogin} />
      </View>


      </View>
      <View
        style={{
          marginTop: 30,
          flex: 1,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
         onPress={signupScreenOnPress}
        >
          <Text>Don't have an account? <Text style={{color: COLORS.medium_dark_blue}}>Signup</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

export default SigninFooter;
