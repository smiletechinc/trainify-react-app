import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

type ButtonProps = {
title: string;
onPress: any;
};

const TextButton:React.FunctionComponent<ButtonProps>  = (props) => {
  const {title, onPress} = props;

    return(
        <Button title={title} onPress={onPress} /> 
    )
}

const styles = StyleSheet.create({
    container: {
         alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#31A8A8',
      },
loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#009688",
    marginLeft:50,
  },
});

export default TextButton;