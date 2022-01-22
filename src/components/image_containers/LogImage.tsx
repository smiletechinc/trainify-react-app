import React from "react";
import {View, StyleSheet, Image} from 'react-native';

const LogImage = () => {
    return(
        <View style={styles.container}>
       <Image source={require('../../resources/images/Icon-App.png')}
       style={{width: 200, height: 200, marginTop: 64, marginBottom: 20, resizeMode: 'cover'}} />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
    alignItems: 'center', justifyContent: 'center', 
    },
});

export default LogImage;