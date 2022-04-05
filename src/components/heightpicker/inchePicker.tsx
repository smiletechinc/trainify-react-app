import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {styles} from './index';
import {Picker} from '@react-native-picker/picker';

const InchHeightPicker = () => {
  const [currentLanguage, setLanguage] = useState('en');
  const proceedToChangeLanguage = value => {
    console.log('value', value);
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
          <Picker.Item label="Inch" value="0" />
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
      </View>
    </View>
  );
};

export default InchHeightPicker;
