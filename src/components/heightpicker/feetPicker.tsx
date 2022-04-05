import React, {FunctionComponent, useState} from 'react';
import {View, Text} from 'react-native';
import {styles} from './index';
import {Picker} from '@react-native-picker/picker';

type PickerProps = {
  setHeight: any;
};
const FeetHeightPicker: FunctionComponent<PickerProps> = props => {
  const {setHeight} = props;
  const [currentLanguage, setLanguage] = useState('en');
  const proceedToChangeLanguage = value => {
    console.log('value', value);
    setHeight(value);
    setLanguage(value);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Picker
          selectedValue={currentLanguage}
          onValueChange={(value, index) => proceedToChangeLanguage(value)}
          mode="dropdown" // Android only
          style={styles.picker}>
          <Picker.Item label="feet" value="0" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
        </Picker>
      </View>
    </View>
  );
};

export default FeetHeightPicker;
