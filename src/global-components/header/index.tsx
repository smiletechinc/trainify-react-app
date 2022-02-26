import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS, SCREEN_WIDTH} from '../../constants';
import globalStyles from '../../global-styles';
import styles from './styles';
import { AuthContext } from './../../context/auth-context';
import { RootState } from '../../../store';
import { useSelector} from 'react-redux';

const profileIcon = require('../../assets/images/profile-icon.png');

const SimpleHeader: FunctionComponent = ({ navigation }) => {
  const UserData = useSelector((state: RootState) => state.RegisterReducer.UserData);
  // console.log('authUser.... : ', UserData);
  // const { authUser } =  React.useContext(AuthContext);
 
  const {lastName} = UserData ? UserData : React.useContext(AuthContext).authUser;

  // const navigation = useNavigation();  
  return(
    <View style={styles.header_main_view}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={[globalStyles.medium, {color: COLORS.light_blue, fontWeight: '600'}]}>{lastName}, </Text>
        <Image source={profileIcon} style={styles.header_profile_icon} />
      </View>
    </View>
  )
};
export default SimpleHeader;
