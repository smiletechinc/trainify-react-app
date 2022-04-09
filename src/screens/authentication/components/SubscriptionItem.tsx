import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
// Constants.
import {COLORS, SCREEN_WIDTH} from '../../../constants';
import {SimpleButton} from '../../../global-components/button';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from './styles';

const blueTick = require('../../../assets/images/blue-tick.png');

const SubscriptionItemContainer: FunctionComponent = props => {
  const {leftText, rightText, onPress, price, isSelected} = props;
  return (
    <TouchableOpacity
      delayPressIn={0}
      activeOpacity={0.8}
      style={[
        styles.subscription_item_main,
        {
          borderColor: isSelected ? COLORS.medium_dark_blue : COLORS.dark_grey,
          backgroundColor: isSelected ? COLORS.medium_dark_blue : 'transparent',
        },
      ]}
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}>
      <View
        style={{
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: 200,
          }}>
          <Text
            style={[
              globalStyles.medium,
              styles.left_text,
              {color: isSelected ? COLORS.white : COLORS.dark_black},
            ]}>
            {leftText}
          </Text>
          <Text
            style={[
              globalStyles.medium,
              styles.left_text,
              {color: isSelected ? COLORS.white : COLORS.dark_black},
            ]}>
            {rightText}
          </Text>
        </View>
        <View
          style={{width: 200, paddingRight: 70, marginLeft: -18, marginTop: 8}}>
          <Text
            style={[
              globalStyles.medium,
              {textAlign: 'right'},
              isSelected ? styles.price_selected : styles.price_unselected,
            ]}>
            {price}
          </Text>
          <Text
            style={[
              globalStyles.small,
              {textAlign: 'right'},
              {
                color: isSelected ? COLORS.white : COLORS.dark_black,
                fontWeight: '400',
              },
            ]}>
            2 hrs/mo 729p at 30fps
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default SubscriptionItemContainer;
