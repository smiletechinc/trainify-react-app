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
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import {FeetHeightPicker} from '../components/heightpicker';
import ModalWrapper from '../components/wrappers/ModalWrapper';

type Props = {
  visible: boolean;
  setFeet: any;
  close: any;
};
const FeetHeightPickerModal: FunctionComponent<Props> = props => {
  const {visible, setFeet, close} = props;

  return (
    <ModalWrapper visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Feet</Text>
          <FeetHeightPicker feet={setFeet} />
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

export default FeetHeightPickerModal;
