import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, FlatList, Text, Alert} from 'react-native';
import styles from './analysis_screen_style';
import {ListItem} from '../../../../components/grid/index';
import EmptyState from '../../../../components/empty_states/colors_empty_state';
import {fetchVideosService} from './../../../../services/servePracticeServices';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-navigation';
import {SCREEN_WIDTH} from '../../../../constants';

type Props = {
  navigation: any;
  route: any;
  reduxVideos: any;
  updated: boolean;
  add: any;
};

const ServePracticeAnalysisGridScreen: FunctionComponent<Props> = props => {
  const {
    authUser,
    authObject,
    setAuthUser: setUser,
    logoutUser,
  } = React.useContext(AuthContext);
  const {navigation, route, reduxVideos, updated, add} = props;
  const [videos, setVideos] = useState(reduxVideos);
  const [dailyVideos, setDailyVideos] = useState(reduxVideos);
  const [weeklyVideos, setWeeklyVideos] = useState(reduxVideos);
  const [monthlyVideos, setMonthlyVideos] = useState(reduxVideos);
  const [selectedID, setSelectedID] = useState();
  const [indexSegment, setSegmentIndex] = useState(0);
  const [flatListWidth, setFlatListWith] = useState(0);
  const [NumberOfColumns, setNumberOfColumns] = useState(0);

  const fetchVideosFailure = colorsError => {
    console.log('videosError: ', colorsError);
  };

  const fetchVideosSuccess = videosData => {
    const videos_ = Object.values(videosData);

    const filterVideos = videos_.filter(
      video => video.createrId === authObject.id,
    );

    const filterDayVideos = filterVideos.filter(dayVideo => {
      const diffDays = Math.round(
        Math.abs(
          (new Date(dayVideo.timestamp).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      if (diffDays <= 1) return dayVideo;
    });

    const filterWeeklyVideos = filterVideos.filter(weekVideo => {
      const diffDays = Math.round(
        Math.abs(
          (new Date(weekVideo.timestamp).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );

      if (diffDays <= 7) return weekVideo;
    });

    const filterMonthlyVideos = filterVideos.filter(monthVideo => {
      const diffDays = Math.round(
        Math.abs(
          (new Date(monthVideo.timestamp).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      if (diffDays <= 30) return monthVideo;
    });
    setVideos(filterVideos);
    setDailyVideos(filterDayVideos.reverse());
    setWeeklyVideos(filterWeeklyVideos.reverse());
    setMonthlyVideos(filterMonthlyVideos.reverse());
  };

  useEffect(() => {
    console.log('Width of Screen is:', (SCREEN_WIDTH * 0.9) / 2 - 23);
    fetchVideosService(fetchVideosSuccess, fetchVideosFailure); //call reducrer action
  }, []);

  useEffect(() => {
    if (SCREEN_WIDTH <= 375) {
      setNumberOfColumns(3);
    } else {
      setNumberOfColumns(4);
    }
  });

  const handleOnClickVideo = item => {
    setSelectedID(item.id);
    navigation.navigate('VideoPlayerContainer', {
      video: item,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        video={item}
        index={index + 1}
        itemWidth={flatListWidth - 11}
        thumbImageWidth={flatListWidth - 16}
        thumbTexWidth={(flatListWidth - 13) / 2}
        itemHeight={100}
        thumbImageHeight={48}
        thumbTextHeight={45}
        onPress={() => handleOnClickVideo(item)}
      />
    );
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setFlatListWith(width / NumberOfColumns);
  };

  const onLayout = event => {
    console.log('ScreenWidth:', SCREEN_WIDTH);
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log('Dimensions : ', x, y, height, width);
  };
  return (
    <ScreenWrapperWithHeader
      title="Anaylsis Report"
      navigation={navigation}
      route={route}
      logoutcheck={false}>
      <View style={styles.main_view}>
        <View style={{marginTop: 32, justifyContent: 'center'}}>
          <SegmentedControl
            values={['Daily', 'Weekly', 'Monthly']}
            selectedIndex={indexSegment}
            onChange={event => {
              setSegmentIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor="#008EC1"
            backgroundColor="#D3D3D3"
            style={{height: 32}}
          />
        </View>
        <View style={styles.flatcontainer}>
          {indexSegment === 0 && (
            <View>
              {dailyVideos?.length > 0 ? (
                <FlatList
                  onLayout={onLayout}
                  style={styles.listContainer}
                  data={dailyVideos}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={selectedID}
                  numColumns={NumberOfColumns}
                  renderItem={renderItem}
                />
              ) : (
                <EmptyState
                  heading="No videos to show"
                  description="Please upload videos to be previewd"
                  buttonTitle="Add COlor"
                  onPress={handleOnClickVideo}
                />
              )}
            </View>
          )}

          {indexSegment === 1 && (
            <View>
              {weeklyVideos?.length > 0 ? (
                <FlatList
                  onLayout={onLayout}
                  style={styles.listContainer}
                  data={weeklyVideos}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={selectedID}
                  numColumns={NumberOfColumns}
                  renderItem={renderItem}
                />
              ) : (
                <EmptyState
                  heading="No videos to show"
                  description="Please upload videos to be previewd"
                  buttonTitle="Add COlor"
                  onPress={handleOnClickVideo}
                />
              )}
            </View>
          )}

          {indexSegment === 2 && (
            <View>
              <FlatList
                onLayout={onLayout}
                style={styles.listContainer}
                data={videos}
                keyExtractor={(item, index) => index.toString()}
                extraData={selectedID}
                numColumns={2}
                renderItem={renderItem}
              />
            </View>
          )}
        </View>
      </View>
    </ScreenWrapperWithHeader>
  );
};
export default ServePracticeAnalysisGridScreen;
