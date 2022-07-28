import React, {FunctionComponent, useEffect} from 'react';
import {Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';

import styles from '../../styles';
import globalStyles from '../../../../global-styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../../context/auth-context';
import ScreenWrapperWithHeader from '../../../../components/wrappers/screen_wrapper_with_header';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../../constants';

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
      route={route}
      logoutcheck={false}>
      <View
        style={[
          styles.home_main_view,
          {
            paddingBottom: SCREEN_WIDTH * 0.01,
            minHeight: SCREEN_WIDTH * 0.92,
          },
        ]}>
        {playerstyle === 'LeftHanded' ? (
          <View
            style={{
              marginTop: (SCREEN_WIDTH / 100) * 8.5,
              paddingBottom: SCREEN_WIDTH * 0.01,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={() => {
                navigation.navigate('TensorCameraContainer', {
                  title: 'RECORD Rally / BALL MACHINE',
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
                  marginHorizontal: (SCREEN_HEIGHT / 100) * 10.5,
                  paddingBottom: (SCREEN_WIDTH / 100) * 4.5,
                }}>
                <View style={{marginLeft: (SCREEN_HEIGHT / 100) * 3.5}}>
                  <Image
                    source={recordIcon}
                    style={{
                      marginLeft: (SCREEN_HEIGHT / 100) * 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: (SCREEN_WIDTH / 100) * 4.5,
                    }}
                  />
                  <Text style={styles.record_and_upload_text}>
                    Record Rally / Ball Machine
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              marginTop: (SCREEN_WIDTH / 100) * 8.5,
              paddingBottom: SCREEN_WIDTH * 0.01,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={() => {
                navigation.navigate('TensorCameraContainer', {
                  title: 'RECORD Rally / BALL MACHINE',
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
                  marginHorizontal: (SCREEN_HEIGHT / 100) * 10.5,
                  paddingBottom: (SCREEN_WIDTH / 100) * 4.5,
                }}>
                <View style={{marginLeft: (SCREEN_HEIGHT / 100) * 3.5}}>
                  <Image
                    source={recordIcon}
                    style={{
                      marginLeft: (SCREEN_HEIGHT / 100) * 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: (SCREEN_WIDTH / 100) * 4.5,
                    }}
                  />
                  <Text style={styles.record_and_upload_text}>
                    Record Rally / Ball Machine
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            marginTop: (SCREEN_WIDTH / 100) * 5.5,
            justifyContent: 'center',
          }}>
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
                marginHorizontal: (SCREEN_HEIGHT / 100) * 10.5,
                flex: 1,
                paddingBottom: (SCREEN_WIDTH / 100) * 4.5,
              }}>
              <View style={{marginLeft: (SCREEN_HEIGHT / 100) * 3.5}}>
                <Image
                  source={analysisIcon}
                  style={{
                    marginLeft: (SCREEN_HEIGHT / 100) * 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: (SCREEN_WIDTH / 100) * 3.5,
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
