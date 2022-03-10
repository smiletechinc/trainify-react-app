import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {VideoData} from '../../../types';
import {styles} from './index';

const playerImage = require('../../assets/images/player_Grid.jpeg');

type Props = {
  video: VideoData;
  itemWidth: number;
  onPress: any;
};

const ListItem: React.FunctionComponent<Props> = props => {
  const {video, onPress, itemWidth} = props;
  console.log('VideoThumb:', video.thumbnail);
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.itemContainer,
          {
            width: itemWidth - 12,
          },
        ]}>
        <View style={{marginLeft: -10}}>
          <Image
            source={video.thumbnail}
            style={{height: 185, width: itemWidth - 17}}
          />
        </View>
        <View
          style={{
            marginLeft: -8,
            height: 110,
            display: 'flex',
            flexDirection: 'row',
            marginBottom: -8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[styles.itemName, {width: (itemWidth - 15) / 2}]}>
            {video.fileName}
          </Text>
          <Text style={[styles.itemCode, {width: (itemWidth - 15) / 2}]}>
            {video.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
