import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import styles from './analysis_screen_style';
import { connect, useDispatch } from 'react-redux';
import { ListItem } from '../../../../components/grid/index';
import EmptyState from '../../../../components/empty_states/colors_empty_state';
import { fetchVideosService } from './../../../../services/servePracticeServices';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-navigation';

type Props = {
  navigation: any;
  route: any;
  reduxColors: any;
  updated: boolean;
  add: any
}

const ServePracticeAnalysisGridScreen: FunctionComponent<Props> = (props) => {

  const {navigation, route, reduxColors, updated, add} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [videos, setVideos] = useState(reduxColors);
  const [updatingColors, setUpdatingColors] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState();
  const [index, setIndex] = useState(0);
 

  const fetchVideosFailure = (colorsError) => {
    console.log('videosError: ', colorsError);
  }

  const fetchVideosSuccess = (videosData) => {
    console.log('videosData:', Object.values(videosData));
    const videos = Object.values(videosData);
    console.log("videos ", videos);
    setVideos(videos);
  }

  useEffect(() => {
    fetchVideosService(fetchVideosSuccess, fetchVideosFailure)  //call reducrer action
  }, []);
 
  const handleOnClickVideo = (item) => {
    console.log("ColorID:", item.id);
    setSelectedID(item.id);
    console.log("selectedid is :",selectedID);
    navigation.navigate('VideoPlayerContainer', {video:item});
  }

  const onRefresh = () => {
    setIsFetching(!isFetching)
  };

  const renderItem = ({item}) => {
    if(item.id===selectedID){
      return (
        <ListItem
        video={item}
        onPress = {() => handleOnClickVideo(item)}
      />
      )
    }
    else {
      return(
        <ListItem
            video={item}
            onPress = {() => handleOnClickVideo(item)}
          />
      )
    }
  }
  return(
    <SafeAreaView style={styles.main_view}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderWithText
          text = "Analysis Report"
          navigation={navigation}
        />
        <View 
          style={{marginTop:32, justifyContent:"center",
           
          }}
        >
          <SegmentedControl
            values={['Daily', 'Weekly', 'Monthly']}
            selectedIndex={index}
            onChange={(event) => {
              setIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor='#0096FF'
            backgroundColor='#D3D3D3'
            style={{height:32}}
          />
        </View>
        <View style={styles.flatcontainer}>
          {videos && videos.length > 0 ?     
            <View>
              <FlatList style = { styles.listContainer }
                data = { videos }
                keyExtractor={(item, index) => index.toString()}
                extraData={selectedID}
                numColumns={3}
                renderItem = {renderItem}
              />
            </View> :
            <EmptyState heading='No videos to show' 
              description='Please upload videos to be previewd'
              buttonTitle='Add COlor'
              onPress={handleOnClickVideo}
            />
          }
        </View>
      </KeyboardAwareScrollView> 
    </SafeAreaView>
  )
};
export default ServePracticeAnalysisGridScreen;