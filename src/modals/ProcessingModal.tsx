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
import ModalWrapper from '../components/wrappers/ModalWrapper';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../constants';

type Props = {
  visible: boolean;
  title: string;
  desc?: string;
  buttonTitle?: string;
  onAcceptButton?: any;
  onCancelButton?: any;
};
const ProcessingModal: FunctionComponent<Props> = props => {
  const {visible, title, desc, buttonTitle, onAcceptButton, onCancelButton} =
    props;
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        close();
      }}
      onOrientationChange={() => 'landscape'}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {width: SCREEN_WIDTH * 0.75}]}>
          <Text style={[styles.modalText, {fontWeight: 'bold', fontSize: 16}]}>
            {title}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => onCancelButton()}>
              <Text style={styles.textStyle1}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProcessingModal;
