import React, {Children, FunctionComponent, useEffect, useState} from 'react';
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

type Props = {
  visible: boolean;
  children?: any;
};
const ModalWrapper: FunctionComponent<Props> = props => {
  const {children, visible} = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        close();
      }}>
      {children}
    </Modal>
  );
};

export default ModalWrapper;
