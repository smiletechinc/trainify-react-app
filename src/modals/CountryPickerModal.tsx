import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  Platform,
  Alert,
  Button,
  Modal,
  Pressable,
} from 'react-native';
import CountryPicker from 'rn-country-dropdown-picker';
import styles from './styles';

type Props = {
  visible: boolean;
  setNation: any;
  close: any;
};
const CountryPickerModal: FunctionComponent<Props> = props => {
  const {visible, setNation, close} = props;
  function handleSelection(e) {
    setNation(e.country);
    console.log(e.country);
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        close();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CountryPicker
            InputFieldStyle={{
              borderWidth: 2,
              borderRadius: 10,
              marginVertical: 8,
              borderColor: '#008EC1',
            }}
            DropdownContainerStyle={{
              borderColor: 'blue',
            }}
            DropdownRowStyle={{
              borderColor: 'green',
            }}
            Placeholder="choose country ..."
            DropdownCountryTextStyle={{
              borderColor: 'purple',
              fontSize: 16,
            }}
            countryNameStyle={{
              borderColor: 'yellow',
            }}
            flagSize={24}
            selectedItem={handleSelection}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => close()}>
            <Text style={styles.textStyle1}>Select</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CountryPickerModal;
