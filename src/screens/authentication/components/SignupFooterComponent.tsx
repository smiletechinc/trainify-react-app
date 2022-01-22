import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
// Constants.
import { COLORS } from '../../../constants';
import { SimpleButton } from '../../../global-components/button';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from '../styles';

const SignupFooter: FunctionComponent = (props) => {
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
        <SimpleButton 
          buttonText="Next"
          buttonType="AUTHENTICATION"
          onPress={() => {
            props.onPress();
            // props.navigation.navigate('PaymentPlan');
            // console.log('pressed');
          }}
          buttonStyles={{
            height: 46,
            borderRadius: 20,
          }}

        />
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
