import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import {Metadata} from '../../types';

type IconButtonProps = {
  onPress: any;
  icon: string;
  transparent:boolean;
  styles?: Metadata | undefined;
}

const IconButton: React.FunctionComponent<IconButtonProps> = ( props ) => {
  const {onPress, icon, transparent} = props;
const overrrideStyles = props.styles;
    return(
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[styles.iconButtonContainer, {opacity:transparent ? 1 : 0}, overrrideStyles]} >
          <Image source={icon}
                 style={styles.icon} /> 
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    iconButtonContainer:{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        resizeMode: 'cover',
      }
});

export default IconButton;