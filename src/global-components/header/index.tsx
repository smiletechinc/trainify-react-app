import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS, SCREEN_WIDTH} from '../../constants';
import globalStyles from '../../global-styles';
import styles from './styles';

const profileIcon = require('../../assets/images/profile-icon.png');

const SimpleHeader: FunctionComponent = ({ navigation }) => {
<<<<<<< Updated upstream
=======
  const { authUser} = React.useContext(AuthContext);
  console.log('authUser : ', authUser);
  const {lastName} = authUser ? authUser : "";
>>>>>>> Stashed changes
  // const navigation = useNavigation();  
  return(
    <View style={styles.header_main_view}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={[globalStyles.medium, {color: COLORS.light_blue, fontWeight: '600'}]}>Hello, </Text>
        <Image source={profileIcon} style={styles.header_profile_icon} />
      </View>
    </View>
  )
};
export default SimpleHeader;
