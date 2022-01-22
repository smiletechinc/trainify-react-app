import React from "react";
import {View, StyleSheet, Image} from 'react-native';

const LogoImage = () => {
    return(
    <View style={styles.container}>
       <Image source={require('../../resources/images/Icon-App.png')}
       style={{width: 200, height: 200,marginTop:70, resizeMode: 'cover'}} />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
    alignItems: 'center', justifyContent: 'center', 
    },
});
export default LogoImage;