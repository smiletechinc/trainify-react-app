// import React in our code
import React, {useState, useRef, useEffect, FunctionComponent} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';
import HeaderWithText from '../../global-components/header/HeaderWithText';
import {SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  title?: string;
  navigation: any;
  route: any;
  children?: any;
};

const ScreenWrapperWithHeader: FunctionComponent<Props> = props => {
  const {title, children, navigation} = props;
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header_view}>
        <HeaderWithText text={title} navigation={navigation} />
      </View>
      <View>{children}</View>
    </KeyboardAwareScrollView>
  );
};

export default ScreenWrapperWithHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingTop: STATUS_BAR_HEIGHT,
    minHeight: 48,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
  },
});
