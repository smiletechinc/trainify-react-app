import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, FlatList, Text} from 'react-native';
import styles from './analysis_screen_style';
import {connect, useDispatch} from 'react-redux';
import {ListItem} from '../../../../components/grid/index';
import EmptyState from '../../../../components/empty_states/colors_empty_state';
import {fetchVideosService} from './../../../../services/servePracticeServices';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-navigation';
import {SCREEN_WIDTH} from '../../../../constants';
import {AuthContext} from '../../../../../src/context/auth-context';
import ScreenWrapperWithHeader from '../../../../components/wrappers/screen_wrapper_with_header';

type Props = {
  navigation: any;
  route: any;
  reduxColors: any;
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
  const {navigation, route, reduxColors, updated, add} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [videos, setVideos] = useState(reduxColors);
  const [updatingColors, setUpdatingColors] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState();
  const [index, setIndex] = useState(0);
  const [filterValue, setFilterValue] = useState<string>('Daily');
  const [flatListWidth, setFlatListWith] = useState(0);
  const [NumberOfColumns, setNumberOfColumns] = useState(0);

  const fetchVideosFailure = colorsError => {
    console.log('videosError: ', colorsError);
  };

  const fetchVideosSuccess = videosData => {
    const videos = Object.values(videosData);
    setVideos(videos);
  };

  useEffect(() => {
    fetchVideosService(
      fetchVideosSuccess,
      fetchVideosFailure,
      'servePracticeVideos',
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
    setSelectedID(item.id);
    console.log('selectedid is :', selectedID);
    navigation.navigate('VideoPlayerContainer', {
      video: item,
    });
  };

  const onRefresh = () => {
    setIsFetching(!isFetching);
  };

  function DaysBetween(StartDate, EndDate) {
    const oneDay = 1000 * 60 * 60 * 24;

    const start = Date.UTC(
      EndDate.getFullYear(),
      EndDate.getMonth(),
      EndDate.getDate(),
    );
    const end = Date.UTC(
      StartDate.getFullYear(),
      StartDate.getMonth(),
      StartDate.getDate(),
    );

    return (start - end) / oneDay;
  }
  const renderItem = ({item, index}) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(item.timestamp).getTime();
    const secondDate = new Date().getTime();

    const diffDays = Math.round(
      Math.abs((firstDate - secondDate) / (1000 * 60 * 60 * 24)),
    );
    if (filterValue === 'Daily') {
      if (authObject && authObject.id === item.createrId && diffDays <= 1) {
        return (
          <ListItem
            video={item}
            index={index + 1}
            itemWidth={flatListWidth}
            onPress={() => handleOnClickVideo(item)}
          />
        );
      }
    }
    if (filterValue === 'Weekly') {
      if (authObject && authObject.id === item.createrId && diffDays <= 7) {
        return (
          <ListItem
            video={item}
            index={index + 1}
            itemWidth={flatListWidth}
            onPress={() => handleOnClickVideo(item)}
          />
        );
      }
    }
    if (filterValue === 'Monthly') {
      if (authObject && authObject.id === item.createrId && diffDays <= 30) {
        return (
          <ListItem
            video={item}
            index={index + 1}
            itemWidth={flatListWidth}
            onPress={() => handleOnClickVideo(item)}
          />
        );
      }
    }
  };

  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
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
              setFilterValue(event.nativeEvent.value);
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
export default ServePracticeAnalysisGridScreen;
