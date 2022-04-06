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
import styles from './styles';
import RatingPicker from '../components/ratingPicker/RatingPicker';

type Props = {
  visible: boolean;
  setRating: any;
  close: any;
};
const RatingPickerModal: FunctionComponent<Props> = props => {
  const {visible, setRating, close} = props;
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
          <Text style={styles.modalText}>Select Rating</Text>
          <RatingPicker rating={setRating} />
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

export default RatingPickerModal;
