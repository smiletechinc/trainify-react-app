import React, {FunctionComponent} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import {SCREEN_WIDTH} from '../constants';
import styles from './styles';

const closeModalButton = require('../assets/images/closeModalButton.png');

type Props = {
  visible: boolean;
  title: string;
  desc: string;
  buttonTitle?: string;
  onAcceptButton?: any;
  onCancelButton?: any;
};
const LogoutAlertModal: FunctionComponent<Props> = props => {
  const {visible, title, desc, buttonTitle, onAcceptButton, onCancelButton} =
    props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        close();
      }}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {width: SCREEN_WIDTH * 0.75}]}>
          <Text style={[styles.modalText, {fontWeight: 'bold', fontSize: 16}]}>
            {title}
          </Text>
          <Text style={styles.modalText}>{desc}</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Pressable
              style={{
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
                elevation: 2,
                backgroundColor: '#ffffff',
                borderColor: '#2196F3',
                borderWidth: 1,
                display: 'flex',
                // flex: 1,
                marginLeft: 16,
                // paddingVertical: 32,
                // alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => onCancelButton()}>
              <Text
                style={{
                  color: '#2196F3',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Cancel
              </Text>
            </Pressable>
            {buttonTitle && (
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  {marginLeft: 16, borderWidth: 1, borderColor: '#2196F3'},
                ]}
                onPress={() => onAcceptButton()}>
                <Text style={styles.textStyle1}>{buttonTitle}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutAlertModal;
