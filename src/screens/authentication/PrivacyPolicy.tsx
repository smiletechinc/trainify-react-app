import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
// Custom UI components.
import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
const avatarIcon = require('../../assets/images/avatar.png');

import {AuthContext} from './../../context/auth-context';
import ScreenWrapperWithHeader from '../../components/wrappers/screen_wrapper_with_header';
import {
  logoutService,
  deleteAccountService,
} from '../../services/authenticationServices';
import RNRestart from 'react-native-restart'; // Import package from node modules
import LogoutAlertModal from '../../modals/LogoutAlerModal';
import ScreenWrapperWithHeaderTermsPrivacyPolicy from '../../components/wrappers/terms_privacy_header_wrapper';
import {stack} from '@tensorflow/tfjs-core';
import SigninFooterComponent from './components/SigninFooterComponent';
import {SettingContext} from '../../context/useSetting-context';

type Props = {
  navigation?: any;
  route?: any;
};

const PrivacyPolicyScreen: FunctionComponent<Props> = props => {
  const {navigation, route} = props;
  const [logOutCheck, setLogOutCheck] = useState(false);
  const [deleteAccountCheck, setDeleteAccountCheck] = useState(false);
  const {isTermCheck, isPrivacyCheck, setTermCheck, setPrivacyCheck} =
    React.useContext(SettingContext);

  const privacyCheckFunction = () => {
    setPrivacyCheck();
    navigation.goBack();
  };
  return (
    <ScreenWrapperWithHeaderTermsPrivacyPolicy title="PRIVACY POLICY">
      <View style={[styles.home_main_view]}>
        <View>
          <View>
            <Text style={styles.record_and_upload_text}>
              Without expectation of compensation or other remuneration, now or
              in the future, I hereby give my consent to ___Trainify
              Inc.________, its affiliates and agents, to use my image/video and
              likeness and/or any interview statements from me in its mobile
              applications, publications, advertising or other media activities
              (including the Internet).
            </Text>
          </View>
          <View style={{marginTop: 16}}>
            <Text style={styles.record_and_upload_text}>
              This consent includes, but is not limited to:
            </Text>
          </View>
          <View>
            <Text style={[styles.record_and_upload_text, {textAlign: 'left'}]}>
              (a) Permission to interview, film, photograph, tape, or otherwise
              make a video reproduction of me and/or record my voice;
            </Text>
          </View>
          <View style={{marginTop: 16}}>
            <Text style={[styles.record_and_upload_text, {textAlign: 'left'}]}>
              (b) Permission to use my name; and
            </Text>
          </View>
          <View style={{marginTop: 16}}>
            <Text style={[styles.record_and_upload_text, {textAlign: 'left'}]}>
              (c) Permission to use quotes from the interview(s) (or excerpts of
              such quotes), the film, photograph(s), tape(s) or reproduction(s)
              of me, and/or recording of my voice, in part or in whole, in its
              mobile applications, publications, in newspapers, magazines and
              other print media, on television, radio and electronic media
              (including the Internet), in theatrical media and/or in mailings
              for educational and awareness.
            </Text>
          </View>
          <View style={{marginTop: 16}}>
            <Text style={styles.record_and_upload_text}>
              This consent is given in perpetuity, and does not require prior
              approval by me.
            </Text>
          </View>

          <View style={{marginTop: 16}}>
            <Text style={styles.record_and_upload_text}>
              Moreover, I will not share the video content given to me to
              perform the exercises nor I will share the video of my exercise
              performance on any social media platform nor anywhere else other
              than Trainify Inc
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{marginTop: 32, marginBottom: 32}}
          onPress={() => {
            privacyCheckFunction();
          }}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 20,
              borderColor: '#008EC1',
              display: 'flex',
              flex: 1,
              paddingVertical: 12,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              backgroundColor: '#008EC1',
            }}>
            <Text style={{fontSize: 18, lineHeight: 22, color: 'white'}}>
              Agree
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenWrapperWithHeaderTermsPrivacyPolicy>
  );
};
export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  home_main_view: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? (SCREEN_WIDTH / 100) * 2 : 10,
    paddingHorizontal: SCREEN_WIDTH * 0.14,
    minHeight: '100%',
  },
  record_and_upload_text: {
    lineHeight: 20,
    fontWeight: 'normal',
    color: '#ADADAD',
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontSize: 13,
  },
});
