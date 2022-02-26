import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { VideoData } from '../../../types';
import { styles } from './index';

const playerImage = require('../../assets/images/player_Grid.jpeg');

type Props = {
    video: VideoData;
    onPress: any;
}

const ListItem: React.FunctionComponent<Props>= (props) => {
const {video, onPress} = props;
 
    return (
        <TouchableOpacity onPress={onPress}>
        <View style={[styles.itemContainer, { backgroundColor: "#D3D3D3", borderWidth:2, borderColor:"grey", marginTop:32 }]}>
            <View style={{marginLeft:-10}}>
              <Image source={playerImage} style={{height:185, width:205}}/> 
            </View>
            <View style={{marginLeft:-8 ,height:110, display:'flex', flexDirection:"row", marginBottom:-8,justifyContent:"space-between", alignItems:"center"}}>
              <Text style={styles.itemName}>{video.fileName}</Text>
              <Text style={styles.itemCode}>{video.duration}</Text>
            </View>
        </View>
       
      </TouchableOpacity> 
    );
}

export default ListItem;
