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
import RNGooglePlacePicker from 'react-native-google-place-picker';
import ModalWrapper from '../components/wrappers/ModalWrapper';
import styles from './styles';

type Props = {
  visible: boolean;
  setLocation: any;
  close: any;
};
const LocationPickerModal: FunctionComponent<Props> = props => {
  const {visible, setLocation, close} = props;
  const [placePick, setPlacePick] = useState({location: null});

  const Place = () => {
    RNGooglePlacePicker.show(response => {
      if (response.didCancel) {
        console.log('User cancelled GooglePlacePicker');
      } else if (response.error) {
        console.log('GooglePlacePicker Error: ', response.error);
      } else {
        setPlacePick({
          location: response,
        });
      }
    });
  };
  return (
    <ModalWrapper visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Date of Birth</Text>
          <TouchableOpacity onPress={Place}>
            <Text style={{color: '#72c02c', fontSize: 20, fontWeight: 'bold'}}>
              Click me to push Google Place Picker!
            </Text>
          </TouchableOpacity>
          <View style={{backgroundColor: 'white', margin: 25}}>
            <Text style={{color: 'black', fontSize: 15}}>
              {JSON.stringify(placePick)}
            </Text>
          </View>
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

export default LocationPickerModal;
