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
import ModalWrapper from '../components/wrappers/ModalWrapper';
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
    <ModalWrapper visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Country</Text>
          <CountryPicker
            InputFieldStyle={{
              borderWidth: 1,
              marginTop: 8,
              borderColor: 'gray',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 6,
              borderBottomWidth: 1,
            }}
            DropdownContainerStyle={{
              opacity: 10,
              width: '100%',
              // minHeight: 100,
              marginBottom: 8,
            }}
            DropdownRowStyle={{
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
              justifyContent: 'flex-start',
              paddingHorizontal: 7,
              width: '100%',
            }}
            Placeholder="Search Country"
            DropdownCountryTextStyle={{
              fontSize: 20,
              marginVertical: 5,
              width: '100%',
              paddingStart: 15,
              color: 'black',
            }}
            countryNameStyle={{
              paddingVertical: 8,
              fontSize: 18,
              paddingStart: 10,
              flex: 1,
              color: 'black',
            }}
            flagSize={32}
            selectedItem={handleSelection}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => close()}>
            <Text style={styles.textStyle1}>Select</Text>
          </Pressable>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default CountryPickerModal;
