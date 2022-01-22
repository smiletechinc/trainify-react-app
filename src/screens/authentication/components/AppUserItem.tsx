import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
// Constants.
import { COLORS, SCREEN_WIDTH } from '../../../constants';
import { SimpleButton } from '../../../global-components/button';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from './styles';

const AppUserItem: FunctionComponent = (props) => {
  return(
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.dark_grey,
        height: 46,
        width: SCREEN_WIDTH * 0.9,
        borderRadius: 25,
      }}
    >

    </View>
  );
};
export default AppUserItem
