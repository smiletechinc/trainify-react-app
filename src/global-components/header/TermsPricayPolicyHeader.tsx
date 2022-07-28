import React, {FunctionComponent, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import globalStyles from '../../global-styles';
import styles from './styles';

type Props = {
  text: string;
};
const TermsPrivacyPolicyConditionHeader: FunctionComponent<Props> = props => {
  const {text} = props;

  return (
    <View style={styles.header_with_text_main_view}>
      <View style={{flex: 1}}>
        <Text style={[globalStyles.regular, styles.text]}>{text}</Text>
      </View>
    </View>
  );
};
export default TermsPrivacyPolicyConditionHeader;
