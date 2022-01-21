import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';

// Constants.
import { COLORS } from '../../../constants';
import { SimpleButton } from '../../../global-components/button';

// Custom Styles
import globalStyles from '../../../global-styles';
import styles from '../styles';

const rightRoundedArrow = require('../../../assets/images/right-rounded-arrow.png');

const ResetPasswordFooterContainer: FunctionComponent = (props) => {
  return(
    <View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: 42,
        }}
      >
        <SimpleButton
          buttonText="Reset Password"
          onPress={()=>{
            // 
          }}
          buttonType="SECONDARY"
          buttonStyles={{
            height: 46,
            backgroundColor: COLORS.medium_dark_blue,
            borderRadius: 20,
          }}
        />
      </View>
    </View>
  )
};

export default ResetPasswordFooterContainer;
