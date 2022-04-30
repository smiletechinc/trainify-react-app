import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {VideoData} from '../../../types';
import {styles} from './index';

const playerImage = require('../../assets/images/player_Grid.jpeg');

type Props = {
  video: VideoData;
  itemWidth: number;
  onPress: any;
  index: number;
};

const ListItem: React.FunctionComponent<Props> = props => {
  const {video, onPress, itemWidth, index} = props;
  const [image, setImage] = useState(null);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (video.timestamp) {
      console.log('VideoThumbnail:', video.thumbnailURL);
      setImage(video.thumbnailURL);
      const dateTimeArray = video.timestamp.split(',');
      // console.log('date and time', new Date(video.timestamp).toLocaleString);
      setTime(dateTimeArray[1]);
      setDate(dateTimeArray[0]);
    }
  }, [video.thumbnailURL]);
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
          {image && (
            <Image
              source={{uri: image}}
              style={{height: 135, width: itemWidth - 18}}
            />
          )}
        </View>
        <View
          style={{
            marginLeft: -12,
            height: 55,
            display: 'flex',
            flexDirection: 'row',
            marginBottom: -8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text style={[styles.itemName, {width: (itemWidth - 15) / 2}]}>
              Trainify_{index ? index : 'video'}
            </Text>
          </View>
          <View style={{width: (itemWidth - 15) / 2, paddingRight: 8}}>
            <View style={{marginTop: 0}}>
              <Text style={[styles.itemCode, {textAlign: 'right'}]}>
                {time}
              </Text>
            </View>
            <View style={{marginTop: 0}}>
              <Text style={[styles.itemCode, {textAlign: 'right'}]}>
                {date}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
