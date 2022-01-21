import React, {FunctionComponent} from 'react';
import {TouchableOpacity, TextInput, Text, View} from 'react-native';
import styles from './styles';
import globalStyles from '../../global-styles';
import {COLORS} from '../../constants';
import {Metadata} from '../../types';

type Props = {
  value: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  placeholder?: string;
  onChangeText?: (text: string) => void;
  inputStyles?: Metadata;
  inputParentStyles?: Metadata;
  placeholderTextColor?: string;
  RightComponent?: any;
  multiline?: boolean | undefined;
  secureTextEntry?: boolean;
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
      inputStyles,
      inputParentStyles,
      placeholderTextColor,
      RightComponent,
      multiline,
      secureTextEntry,
    } = props;
    // const [isOnFocused, setIsOnFocused] = useState<boolean>(false);

    return (
      <TouchableOpacity
        delayPressIn={0}
        activeOpacity={0.9}
        style={[
          styles.input_parent_container,
          {...inputParentStyles},
        ]}
      >
        <View>
          <TextInput
            autoCapitalize={autoCapitalize}
            maxLength={maxLength || 10000}
            returnKeyType={returnKeyType || 'done'}
            value={value || ''}
            onChangeText={(text: string) => {
              if (onChangeText) {
                onChangeText(text);
              }
            }}
            placeholder={placeholder || 'User'}
            placeholderTextColor={placeholderTextColor}
            onFocus={() => {
              // console.log('focused');
              // setIsOnFocused(true);
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
