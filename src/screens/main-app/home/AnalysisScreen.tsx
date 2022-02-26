import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert, Image, Text } from 'react-native';
import styles from './analysis_screen_style';
import { connect, useDispatch } from 'react-redux';
import { ListItem } from '../../../components/grid/index';
import EmptyState from '../../../components/empty_states/colors_empty_state';
import { fetchVideosService } from './../../../services/servePracticeServices';


type Props = {
  navigation: any;
  route: any;
  reduxColors: any;
  updated: boolean;
  add: any
}

let updatedOuter = false;

const AnalysisScreen: React.FunctionComponent<Props> = (props) => {
  const {navigation, route, reduxColors, updated, add} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [videos, setVideos] = useState(reduxColors);
  const [updatingColors, setUpdatingColors] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState();

//   useEffect(() => {
//     setVideos(reduxColors);
//     updatedOuter = updated;
//   }, [updated, reduxColors]);


  const fetchVideosFailure = (colorsError) => {
    console.log('videosError: ', colorsError);
    // navigation.replace('HomeScreen');

  }

  const fetchVideosSuccess = (videosData) => {
    //1. Update redux for colors from firebase
    //2. Navigate to home
    console.log('videosData:', Object.values(videosData));
    const videos = Object.values(videosData);
    console.log("videos ", videos);
    setVideos(videos);
  }

  useEffect(() => {
    fetchVideosService(fetchVideosSuccess, fetchVideosFailure)  //call reducrer action
  }, []);

//   const handleAddVideo=()=>{
//     // navigation.navigate('AddColorScreen', route.params );
//     if (response){
//       navigation.navigate('VideoPlayerContainer', {video:response.assets[0]});
//     }
// }
 
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
  return (
    <View style={styles.flatcontainer}>
      {videos && videos.length > 0 ?      <View>
        {/* <FlatG colors={videos}/> */}
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
      onPress={handleOnClickVideo}/>}

    </View>
  );
}

export default AnalysisScreen;
