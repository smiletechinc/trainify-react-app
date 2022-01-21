import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
// Constants.
import { COLORS, SCREEN_WIDTH } from '../../../constants';
import { SimpleButton } from '../../../global-components/button';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from '../styles';

const PlayingStyle: FunctionComponent = (props) => {
  const {handStyle, setHandStyle} = props; 
  return(
    <View style={{
      marginTop: 16,
      width: SCREEN_WIDTH * 0.9,
    }}>
      <Text style={[globalStyles.regular, {color: COLORS.full_black, fontSize: 16, lineHeight: 25, fontWeight: '600'}]}>Your Style</Text>
      <View style={{
        flexDirection: 'row',
        marginTop: 10,
        width: SCREEN_WIDTH * 0.9,
        height: 46,
        borderRadius: 30,
        backgroundColor: COLORS.dark_black,
      }}>
        <TouchableOpacity
          style={{
            height: 46,
            width: ((SCREEN_WIDTH * 0.9) / 2) - 4,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: handStyle === 0 ? COLORS.medium_dark_blue : COLORS.dark_black,
          }}
          onPress={() => {
            setHandStyle(0);
          }}
        >
          <Text style={[globalStyles.medium, { color: COLORS.white, fontWeight: '600' }]}>Left Handed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 46,
            width: ((SCREEN_WIDTH * 0.9) / 2) - 4,
            marginLeft: 8,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: handStyle === 1 ? COLORS.medium_dark_blue : COLORS.dark_black,
          }}
          onPress={() => {
            setHandStyle(1);
          }}
        >
          <Text style={[globalStyles.medium, { color: COLORS.white, fontWeight: '600' }]}>Right Handed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayingStyle;
