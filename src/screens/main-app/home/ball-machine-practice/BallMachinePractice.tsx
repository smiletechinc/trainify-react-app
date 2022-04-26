import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';

import styles from '../../styles';
import globalStyles from '../../../../global-styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../../context/auth-context';
import ScreenWrapperWithHeader from '../../../../components/wrappers/screen_wrapper_with_header';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

const recordIcon = require('../../../../assets/images/record_icon_image.png');
const analysisIcon = require('../../../../assets/images/analysis_icon.png');

type Props = {
  navigation: any;
  route: any;
};

const BallPracticeContainer: FunctionComponent<Props> = ({
  navigation,
  route,
}) => {
  useKeepAwake();
  const {authUser, setAuthUser} = React.useContext(AuthContext);
  const {playerstyle} = authUser ? authUser : '';
  return (
    <ScreenWrapperWithHeader
      title="Ball Machine Practice"
      navigation={navigation}
      route={route}>
      <View style={styles.home_main_view}>
        {playerstyle === 'LeftHanded' ? (
          <View style={{marginTop: 100}}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={() => {
                navigation.navigate('TensorCameraContainer', {
                  title: 'RECORD VOLLEY / BALL MACHINE',
                });
              }}>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 30,
                  backgroundColor: '#EB5757',
                  borderColor: '#EB5757',
                  display: 'flex',
                  flex: 1,
                  height: 150,
                  paddingBottom: 8,
                }}>
                <View style={{marginLeft: 10}}>
                  <Image
                    source={recordIcon}
                    style={{
                      marginLeft: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 40,
                    }}
                  />
                  <Text style={styles.record_and_upload_text}>
                    Record Volley / Ball Machine
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginTop: 16}}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={() => {
                navigation.navigate('TensorCameraContainer', {
                  title: 'RECORD VOLLEY / BALL MACHINE',
                });
              }}>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 30,
                  backgroundColor: '#EB5757',
                  borderColor: '#EB5757',
                  display: 'flex',
                  flex: 1,
                  marginHorizontal: 64,
                  paddingBottom: 20,
                }}>
                <View style={{marginLeft: 10}}>
                  <Image
                    source={recordIcon}
                    style={{
                      marginLeft: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 16,
                    }}
                  />
                  <Text style={styles.record_and_upload_text}>
                    Record Volley / Ball Machine
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={{marginTop: 20}}>
          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            onPress={() => {
              navigation.navigate('BallPracitceAnalysisGridScreen', {
                title: 'Analysis Report',
              });
            }}>
            <View
              style={{
                borderWidth: 2,
                borderRadius: 30,
                backgroundColor: '#F2994A',
                borderColor: '#F2994A',
                display: 'flex',
                marginHorizontal: 64,
                flex: 1,
                paddingBottom: 16,
              }}>
              <View style={{marginLeft: 10}}>
                <Image
                  source={analysisIcon}
                  style={{
                    marginLeft: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16,
                  }}
                />
                <Text style={styles.record_and_upload_text}>
                  Analysis Report
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapperWithHeader>
  );
};
export default BallPracticeContainer;
