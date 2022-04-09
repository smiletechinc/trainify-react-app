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
    </Picker>
  );
};

export default InchHeightPicker;
