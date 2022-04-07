import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, FlatList, Text} from 'react-native';
import styles from './analysis_screen_style';
import {ListItem} from '../../../../components/grid/index';
import EmptyState from '../../../../components/empty_states/colors_empty_state';
import {fetchVideosService} from './../../../../services/servePracticeServices';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {SCREEN_WIDTH} from '../../../../constants';
import ScreenWrapperWithHeader from '../../../../components/wrappers/screen_wrapper_with_header';

type Props = {
  navigation: any;
  route: any;
  reduxColors: any;
  updated: boolean;
  add: any;
};

const BallPracitceAnalysisGridScreen: FunctionComponent<Props> = props => {
  const {navigation, route, reduxColors, updated, add} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [videos, setVideos] = useState(reduxColors);
  const [updatingColors, setUpdatingColors] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState();
  const [index, setIndex] = useState(0);
  const [flatListWidth, setFlatListWith] = useState(0);
  const [NumberOfColumns, setNumberOfColumns] = useState(0);

  const fetchVideosFailure = colorsError => {
    console.log('videosError: ', colorsError);
  };

  const fetchVideosSuccess = videosData => {
    console.log('videosData:', Object.values(videosData));
    const videos = Object.values(videosData);
    console.log('videos ', videos);
    setVideos(videos);
  };

  useEffect(() => {
    fetchVideosService(
      fetchVideosSuccess,
      fetchVideosFailure,
      'ballMachinePracticeVideos',
    ); //call reducrer action
  }, []);

  useEffect(() => {
    if (SCREEN_WIDTH <= 375) {
      setNumberOfColumns(2);
    } else {
      setNumberOfColumns(3);
    }
  });

  const handleOnClickVideo = item => {
    console.log('ColorID:', item.id);
    setSelectedID(item.id);
    console.log('selectedid is :', selectedID);
    navigation.navigate('BallPracticeVideoPlayer', {video: item});
  };

  const onRefresh = () => {
    setIsFetching(!isFetching);
  };

  const renderItem = ({item, index}) => {
    if (item.id === selectedID) {
      return (
        <ListItem
          video={item}
          index={index + 1}
          itemWidth={flatListWidth}
          onPress={() => handleOnClickVideo(item)}
        />
      );
    } else {
      return (
        <ListItem
          video={item}
          index={index + 1}
          itemWidth={flatListWidth}
          onPress={() => handleOnClickVideo(item)}
        />
      );
    }
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log('Dimensions : ', x, y, height, width);
    setFlatListWith(width / NumberOfColumns);
  };

  return (
    <ScreenWrapperWithHeader
      title="Anaylsis Report"
      navigation={navigation}
      route={route}>
      <View style={styles.main_view}>
        <View style={{marginTop: 32, justifyContent: 'center'}}>
          <SegmentedControl
            values={['Daily', 'Weekly', 'Monthly']}
            selectedIndex={index}
            onChange={event => {
              setIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor="#0096FF"
            backgroundColor="#D3D3D3"
            style={{height: 32}}
          />
        </View>
        <View style={styles.flatcontainer}>
          {videos && videos.length > 0 ? (
            <View>
              <FlatList
                onLayout={onLayout}
                style={styles.listContainer}
                data={videos}
                keyExtractor={(item, index) => index.toString()}
                extraData={selectedID}
                numColumns={NumberOfColumns}
                renderItem={renderItem}
              />
            </View>
          ) : (
            <EmptyState
              heading="No videos to show"
              description="Please upload videos to be previewd"
              buttonTitle="Add COlor"
              onPress={handleOnClickVideo}
            />
          )}
        </View>
      </View>
    </ScreenWrapperWithHeader>
  );
};
export default BallPracitceAnalysisGridScreen;
