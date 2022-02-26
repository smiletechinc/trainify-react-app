import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

type SecondaryButtonProps = {
    title: string;
    onPress: any;
}
const SecondaryButton: React.FunctionComponent<SecondaryButtonProps> = (  props  ) => {
    const {title, onPress} = props;
    return(
     <View>
        <TouchableOpacity onPress={onPress}>
            <View style={styles.secondaryButtonContainer}>
                <Text style={{color: "#000000"}}>{title}</Text>
            </View>
        </TouchableOpacity> 
    </View> 
    )
}

const styles = StyleSheet.create({
    secondaryButtonContainer: {
      width: "70%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#31A8A8",
      marginLeft:50,
    },
});

export default SecondaryButton;