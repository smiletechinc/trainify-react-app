import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {styles} from './index';
import {Picker} from '@react-native-picker/picker';

type Props = {
  inch: any;
};
const InchHeightPicker: React.FunctionComponent<Props> = props => {
  const {inch} = props;
  const [currentLanguage, setLanguage] = useState('en');
  const proceedToChangeLanguage = value => {
    inch(value.toString());
    console.log('value', value.toString());
    setLanguage(value);
  };

  return (
    <Picker
      selectedValue={currentLanguage}
      onValueChange={(value, index) => proceedToChangeLanguage(value)}
      style={styles.picker}>
      <Picker.Item label="0" value="0" />
      <Picker.Item label="1" value="1" />
      <Picker.Item label="2" value="2" />
      <Picker.Item label="3" value="3" />
      <Picker.Item label="4" value="4" />
      <Picker.Item label="5" value="5" />
      <Picker.Item label="6" value="6" />
      <Picker.Item label="7" value="7" />
      <Picker.Item label="8" value="8" />
      <Picker.Item label="9" value="9" />
      <Picker.Item label="10" value="10" />
      <Picker.Item label="11" value="11" />
      <Picker.Item label="12" value="12" />
    </Picker>
  );
};

export default InchHeightPicker;
