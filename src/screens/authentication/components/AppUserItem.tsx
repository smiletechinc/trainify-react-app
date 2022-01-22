import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
// Constants.
import { COLORS, SCREEN_WIDTH } from '../../../constants';
import { SimpleButton } from '../../../global-components/button';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from './styles';

const blueTick = require('../../../assets/images/blue-tick.png');

const AppUserItemContainer: FunctionComponent = (props) => {
  const {leftText, onPress, isSelected} = props;
  return(
    <TouchableOpacity
      delayPressIn={0}
      activeOpacity={0.8}
      style={styles.app_user_item_main}
      onPress={()=>{
        if(onPress){
          onPress();
        }
      }}
    >
      <Text style={[globalStyles.medium, styles.left_text]}>{leftText}</Text>
      <TouchableOpacity
        delayPressIn={0}
        activeOpacity={0.8}
        style={[
          styles.right_check_box,
          {
            borderWidth:  isSelected ? 0 : 1,
            borderColor: isSelected ? COLORS.medium_dark_blue : COLORS.dark_black,
          }
        ]}
        onPress={()=>{
          if(onPress){
            onPress();
          }
        }}
      >
        {
          isSelected ? 
            <Image source={blueTick} style={{width: 24, height: 24}}/>
          :
            null
        }
        
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default AppUserItemContainer;

