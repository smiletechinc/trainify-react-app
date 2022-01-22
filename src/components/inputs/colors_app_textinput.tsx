import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Input = {
  placeholder: string;
  onChangeText: any;
  defaultValue: any;
  secureTextEntry?: boolean;
  keyboardType?: any;
  error?: string;
  foucs?: boolean;
}
const AppTextInput:React.FunctionComponent<Input> = ( props ) => {
  const {placeholder, onChangeText, defaultValue, secureTextEntry, keyboardType, error, foucs} = props;

    return(
     <View style={styles.container}>
        <View style={[styles.inputView, {borderColor: error?.trim().length != 0 ? '#ff0f0f' : '#98d3d3'}]}> 
        <TextInput
                style={styles.TextInput}
                placeholder={placeholder}
                onChangeText={onChangeText}
                defaultValue={defaultValue}
                secureTextEntry={secureTextEntry}
                keyboardType = {keyboardType}
            />
        </View>
        <Text style={{marginTop:-16, marginBottom:8}}>{error}</Text>
    </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#31A8A8',
      },
      inputView: {
        backgroundColor: "#98d3d3",
        borderRadius: 30,
        borderWidth: 1,
        //borderColor: 'grey',
        width: "70%",
        height: 45,
        marginBottom: 20,
        //alignItems: "Left",
      },
    
      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
});

export default AppTextInput;