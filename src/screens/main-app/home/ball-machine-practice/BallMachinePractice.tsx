import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';

import styles from '../../styles';
import globalStyles from '../../../../global-styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../../context/auth-context';

const recordIcon = require('../../../../assets/images/record_icon_image.png');
const analysisIcon = require('../../../../assets/images/analysis_icon.png');

type Props = {
  navigation: any;
};

const BallPracticeContainer: FunctionComponent<Props> = ({navigation}) => {
  const {authUser, setAuthUser} = React.useContext(AuthContext);
  const {playerstyle} = authUser ? authUser : '';
  return (
    <SafeAreaView style={styles.main_view}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.navigationBar}>
          <HeaderWithText
            text="Ball Machine Practice"
            navigation={navigation}
          />
        </View>

        {playerstyle === 'LeftHanded' ? (
          <View style={{marginTop: 100}}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={() => {
                navigation.navigate('TensorCameraContainer', {
                  title: 'RECORD RIGHT-HANDED SERVE',
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
                    Record LEFT-Handed Serve
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginTop: 100}}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={() => {
                navigation.navigate('TensorCameraContainer', {
                  title: 'RECORD RIGHT-HANDED SERVE',
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
                    Record RIGHT-Handed Serve
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={{marginTop: 50}}>
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
                flex: 1,
                height: 150,
                paddingBottom: 16,
              }}>
              <View style={{marginLeft: 10}}>
                <Image
                  source={analysisIcon}
                  style={{
                    marginLeft: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40,
                  }}
                />
                <Text style={styles.record_and_upload_text}>
                  Analysis Report
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default BallPracticeContainer;
