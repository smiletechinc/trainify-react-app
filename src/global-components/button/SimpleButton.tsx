import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, ActivityIndicator, View} from 'react-native';
import styles from './styles';
// import globalStyles from '../../global-styles';
import {COLORS} from '../../constants';
import {Metadata} from '../../types';

//A Generic Simple button for gernal purpose button
const BUTTON_STYLES = {
  AUTHENTICATION: {
    textStyles: {color: COLORS.white},
    buttonStyles: {
      backgroundColor: COLORS.medium_dark_blue,
    },
  },

  PRIMARY: {
    textStyles: {color: COLORS.dark_black},
    buttonStyles: {
      backgroundColor: 'rgba(255,255,255, 0.71)',
    },
  },

  DISABLED: {
    textStyles: {color: COLORS.dark_black},
    buttonStyles: {
      backgroundColor: 'rgba(0,98,147,0.2)',
      // opacity: 0.2,
    },
  },
  SECONDARY: {
    textStyles: {color: COLORS.white},
    buttonStyles: {
      backgroundColor: COLORS.dark_black,
    },
  },
};
type Props = {
  buttonType:
    | 'PRIMARY'
    | 'DISABLED'
    | 'SOCIAL'
    | 'SECONDARY'
    | 'AUTHENTICATION';
  buttonText: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  buttonStyles?: Metadata | undefined | any;
  buttonTextStyles?: Metadata | undefined;
  leftComponent?: any;
  rightComponent?: any;
};

/**
 * Simple Button to be use as a default button.
 */
const SimpleButton: FunctionComponent<Props> = function SimpleButton(props) {
  // eslint-disable-next-line prettier/prettier
  const {
    onPress,
    buttonText,
    buttonType,
    buttonStyles,
    buttonTextStyles,
    loading,
    leftComponent,
    right_component,
  } = props;

  return (
    <TouchableOpacity
      delayPressIn={0}
      activeOpacity={0.8}
      disabled={buttonType === 'DISABLED'}
      style={[
        styles.button_container,
        styles.button_shadow,
        BUTTON_STYLES[buttonType].buttonStyles,
        {...buttonStyles},
      ]}
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}>
      {leftComponent || null}
      {loading ? (
        <View
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 16,
          }}>
          <ActivityIndicator
            animating={true}
            size="small"
            color={COLORS.dark_black}
          />
        </View>
      ) : (
        <Text
          style={[
            // globalStyles.regular,
            BUTTON_STYLES[buttonType].textStyles,
            {...buttonTextStyles},
          ]}>
          {buttonText}
        </Text>
      )}
      {right_component || null}
    </TouchableOpacity>
  );
};
export default SimpleButton;
