import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import  styles  from './colors_empty_state_style'
import {PrimaryButton, IconButton} from '../buttons/index'

// const PlusIcon = require("../../resources/images/icon_plus.png");

type Props = {
    onPress: any;
    heading: string;
    description: string;
    buttonTitle: string;
}

const EmptyState: React.FunctionComponent<Props>= (props) => {
const { onPress, heading, description, buttonTitle} = props;
 
    return (
       
        <View style={[styles.itemContainer]}>
          <Text style={styles.itemName}>{heading}</Text>
          <Text style={styles.itemCode}>{description}</Text>
          {/* <PrimaryButton title={buttonTitle} onPress={onPress} /> */}
          {/* <IconButton onPress={onPress} icon={PlusIcon} /> */}
        </View>
      
    );
}

export default EmptyState;
