import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';

type WrapperProps = {
    children: any,
    style: any,
}

const InputsGroupWrapper:React.FunctionalComponents<WrapperProps> = (props) => {
    const {children, style} = props;

    useEffect(() => {
        console.log('useState() for wrapper.');
    });

    return(
        <View style={{width:'100%', height:'100%', backgroundColor:'#00000029', borderRadius:12, paddingTop:0, paddingBottom:0, paddingLeft:28, paddingRight:28}}>
            {children}
        </View>
    );
}

export default InputsGroupWrapper;