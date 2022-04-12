import React, {Children, FunctionComponent} from 'react';
import {
  TouchableOpacity,
  TextInput,
  Text,
  View,
  KeyboardTypeOptions,
  Alert,
} from 'react-native';
import styles from './styles';
import globalStyles from '../../global-styles';
import {COLORS} from '../../constants';
import {Metadata} from '../../types';
import {onFocus} from '@reduxjs/toolkit/dist/query/core/setupListeners';

type Props = {
  inputStyles?: Metadata;
  inputParentStyles?: Metadata;
  placeholderTextColor?: string;
  RightComponent?: any;
  onClick?: any;
  children?: any;
};

const TextInputWrapper: FunctionComponent<Props> = function TextInputComponent(
  props,
) {
  const {onClick, inputParentStyles, RightComponent, children} = props;
  // const [isOnFocused, setIsOnFocused] = useState<boolean>(false);

  return (
    <TouchableOpacity
      delayPressIn={0}
      activeOpacity={0.9}
      onPress={onClick}
      style={[styles.input_parent_container, {...inputParentStyles}]}>
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}>
        {children}
      </View>
      {RightComponent || null}
    </TouchableOpacity>
  );
};
export default TextInputWrapper;
