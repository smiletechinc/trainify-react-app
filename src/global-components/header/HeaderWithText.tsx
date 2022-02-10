import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS, SCREEN_WIDTH} from '../../constants';
import globalStyles from '../../global-styles';
import styles from './styles';

const profileIcon = require('../../assets/images/profile-icon.png');
const backIcon = require('../../assets/images/back-icon.png');

type Props = {
  text: string;
  hideProfileSection?: boolean;
  navigation: any;
}
const HeaderWithText: FunctionComponent<Props> = (props) => {
  // const navigation = useNavigation();
  const {text, hideProfileSection, navigation} = props;
<<<<<<< Updated upstream
=======
  const { authUser, setAuthUser: setUser } = React.useContext(AuthContext);
  const { lastName } = authUser ? authUser : "";

>>>>>>> Stashed changes
  return(
    <View style={styles.header_with_text_main_view}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image source={backIcon} style={{width: 20, height: 20}}/>
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <Text style={[globalStyles.regular, styles.text]}>{text}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          display: hideProfileSection ? 'none' : 'flex',
        }}
      >
        <Text style={[globalStyles.medium, {color: COLORS.light_blue, fontWeight: '600'}]}>Hello, </Text>
        <Image source={profileIcon} style={styles.header_profile_icon} />
      </View>
    </View>
  )
};
export default HeaderWithText;
