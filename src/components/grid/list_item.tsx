import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VideoData } from '../../../types';
import { styles } from './index'

type Props = {
    video: VideoData;
    onPress: any;
}

const ListItem: React.FunctionComponent<Props>= (props) => {
const {video, onPress} = props;
 
    return (
        <TouchableOpacity onPress={onPress}>
        <View style={[styles.itemContainer, { backgroundColor: "blue" }]}>
          <Text style={styles.itemName}>{video.fileName}</Text>
          <Text style={styles.itemCode}>{video.duration}</Text>
        </View>
      </TouchableOpacity> 
    );
}

export default ListItem;
