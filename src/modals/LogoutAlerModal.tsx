import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View, Image, Modal} from 'react-native';
import {SCREEN_WIDTH} from '../constants';

const closeModalButton = require('../assets/images/closeModalButton.png');

type Props = {
  visible: boolean;
  buttonTitle?: string;
  onAcceptButton?: any;
  onCancelButton?: any;
  textTitle?: string;
  textDesc?: string;
};
const LogoutAlertModal: FunctionComponent<Props> = props => {
  const {
    visible,
    textTitle,
    textDesc,
    buttonTitle,
    onCancelButton,
    onAcceptButton,
  } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        close();
      }}>
      <View
        style={{
          justifyContent: 'center',
          marginTop: '48%',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#888888',
          width: SCREEN_WIDTH * 0.89,
          marginHorizontal: SCREEN_WIDTH * 0.05,
        }}>
        <View
          style={[
            {
              backgroundColor: 'white',
              borderRadius: 5,
              paddingVertical: 10,
            },
          ]}>
          <View
            style={{
              alignItems: 'flex-end',
              right: 16,
            }}>
            <TouchableOpacity onPress={onCancelButton}>
              <Image
                source={closeModalButton}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '500',
                lineHeight: 48,
                textAlign: 'center',
                color: '#CF1B27',
              }}>
              {textTitle}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                lineHeight: 20,
                textAlign: 'center',
                color: '#ADADAD',
              }}>
              Are you sure you want to
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                lineHeight: 20,
                textAlign: 'center',
                color: '#ADADAD',
              }}>
              {textDesc}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              height: 68,
              marginHorizontal: '15%',
              marginTop: 32,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={onAcceptButton}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                borderColor: '#CF1B27',
                backgroundColor: '#CF1B27',
                display: 'flex',
                flex: 1,
              }}>
              <View
                style={{
                  top: 22,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    textAlign: 'left',
                    textAlignVertical: 'bottom',
                    fontSize: 18,
                    lineHeight: 22,
                  }}>
                  {buttonTitle}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutAlertModal;
