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
import {AuthContext} from '../../context/auth-context';
import {styles} from './index';

const playerImage = require('../../assets/images/player_Grid.jpeg');

type Props = {
  video: VideoData;
  itemWidth: number;
  thumbImageWidth: number;
  thumbTexWidth: number;
  itemHeight: number;
  thumbImageHeight: number;
  thumbTextHeight: number;
  onPress: any;
  index: number;
};

const ListItem: React.FunctionComponent<Props> = props => {
  const {
    video,
    onPress,
    itemWidth,
    itemHeight,
    thumbImageWidth,
    thumbImageHeight,
    thumbTexWidth,
    thumbTextHeight,
    index,
  } = props;

  const {
    authUser,
    authObject,
    setAuthUser: setUser,
    logoutUser,
  } = React.useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);

  useEffect(() => {
    if (video.timestamp) {
      console.log('VideoThumbnail:', video.thumbnailURL);
      setImage(video.thumbnailURL);
      const d = new Date(video.timestamp);
      const m = d.getMonth() + 1;
      setMonth(m);
      const da = d.getDate();
      setDay(da);
      setYear(22);
      if (day === 1 && month === 1) {
        setYear(year + 1);
      }
      console.log('Date:', month + '/' + day + '/' + year);
    }
  }, [video.thumbnailURL]);
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.itemContainer,
          {
            width: itemWidth,
            height: itemHeight,
          },
        ]}>
        <View style={{marginLeft: -10}}>
          {image && (
            <Image
              source={{uri: image}}
              style={{height: thumbImageHeight, width: thumbImageWidth}}
            />
          )}
        </View>
        <View
          style={{
            marginLeft: -10,
            height: thumbTextHeight,
            display: 'flex',
            flexDirection: 'row',
            marginBottom: -8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text style={[styles.itemName, {width: thumbTexWidth}]}>
              {authObject.firstName}_{index ? index : 'video'}
            </Text>
          </View>
          <View style={{width: thumbTexWidth, paddingRight: 8}}>
            {/* <View style={{marginTop: 0}}>
              <Text style={[styles.itemCode, {textAlign: 'right'}]}>
                {time}
              </Text>
            </View> */}
            <View style={{marginTop: 0, marginLeft: 1}}>
              <Text style={[styles.itemCode, {textAlign: 'right'}]}>
                {month}/{day}/{year}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
