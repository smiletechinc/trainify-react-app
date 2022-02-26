import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import {COLORS} from '../../constants';

type PrimaryButtonProps = {
  title: string;
  onPress: any;
}
const PrimaryButton:React.FunctionComponent<PrimaryButtonProps>  = (props ) => {
  const {title, onPress} = props;
    return(
     <View>
        <TouchableOpacity onPress={onPress}>
            <View style={styles.primaryButtonContainer}>
                <Text style={{color: "#fff"}}>{title}</Text>
            </View>
        </TouchableOpacity> 
    </View> 
    )
}

const styles = StyleSheet.create({
  primaryButtonContainer: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: COLORS.medium_dark_blue,
    color: 'white'
  },
});

export default PrimaryButton;