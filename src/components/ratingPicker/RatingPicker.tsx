import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import {Picker} from '@react-native-picker/picker';

type Props = {
  rating: any;
};
const InchHeightPicker: React.FunctionComponent<Props> = props => {
  const {rating} = props;
  const [currentLanguage, setLanguage] = useState('en');
  const proceedToChangeLanguage = value => {
    rating(value.toString());
    console.log('value', value.toString());
    setLanguage(value);
  };

  return (
    <Picker
      selectedValue={currentLanguage}
      onValueChange={(value, index) => proceedToChangeLanguage(value)}
      style={styles.picker}>
      <Picker.Item label="Beginner 1.0" value="Beginner 1.0" />
      <Picker.Item label="Beginner 1.5" value="Beginner 1.5" />
      <Picker.Item label="Beginner 2.0" value="Beginner 2.0" />
      <Picker.Item label="Intermediate 2.5" value="Intermediate 2.5" />
      <Picker.Item label="Intermediate 3.0" value="Intermediate 3.0" />
      <Picker.Item label="Intermediate 3.5" value="Intermediate 3.5" />
      <Picker.Item label="Advance 4.0" value="Advance 4.0" />
      <Picker.Item label="Advance 4.5" value="Advance 4.5" />
      <Picker.Item label="Advance 5.0" value="Advance 5.0" />
      <Picker.Item label="Advance 5.5" value="Advance 5.5" />
      <Picker.Item label="Advance 6.0" value="Advance 6.0" />
      <Picker.Item label="Advance 6.5" value="Advance 6.5" />
      <Picker.Item label="Advance 7.0" value="Advance 7.0" />
    </Picker>
  );
};

export default InchHeightPicker;
