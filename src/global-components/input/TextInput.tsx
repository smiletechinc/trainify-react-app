import React, {FunctionComponent} from 'react';
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
  value: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  inputStyles?: Metadata;
  inputParentStyles?: Metadata;
  placeholderTextColor?: string;
  RightComponent?: any;
  multiline?: boolean | undefined;
  secureTextEntry?: boolean;
  onClick?: any;
  editable?: boolean;
};

const TextInputComponent: FunctionComponent<Props> =
  function TextInputComponent(props) {
    const {
      value,
      returnKeyType,
      maxLength,
      autoCapitalize,
      onChangeText,
      placeholder,
      onClick,
      inputStyles,
      editable,
      inputParentStyles,
      placeholderTextColor,
      RightComponent,
      multiline,
      secureTextEntry,
      keyboardType,
    } = props;
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
          <TextInput
            keyboardType={keyboardType || 'default'}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength || 10000}
            returnKeyType={returnKeyType || 'done'}
            value={value || ''}
            editable={editable}
            onChangeText={(text: string) => {
              if (onChangeText) {
                onChangeText(text);
              }
            }}
            placeholder={placeholder || 'Input'}
            placeholderTextColor={placeholderTextColor}
            onPressIn={() => {
              onClick && onClick();
            }}
            onBlur={() => {
              // console.log('blur');
              // setIsOnFocused(false);
            }}
            multiline={multiline || false}
            secureTextEntry={secureTextEntry}
            style={[
              globalStyles.h3,
              styles.input_container,
              {
                ...inputStyles,
              },
            ]}
          />
        </View>
        {RightComponent || null}
      </TouchableOpacity>
    );
  };
export default TextInputComponent;
