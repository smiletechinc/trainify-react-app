// React Native Video Library to Play Video in Android and IOS
// https://aboutreact.com/react-native-video/

// import React in our code
import React, {useState, useRef, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';

// Import React Native Video to play video
import Video from 'react-native-video';

// Media Controls to control Play/Pause/Seek and full screen
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';

const backIcon = require('../../../../assets/images/back-icon.png');

const ServePracticeVideoPlayerContainer = ({navigation, route}) => {
  const {video} = route.params;

  let fileURI =
    'https://firebasestorage.googleapis.com/v0/b/trainify-app-firebase.appspot.com/o/videos%2Fy2mate.com.mp4?alt=media&token=a567aa95-2423-496a-977d-cc496f6140f6';
  if (video && video.uri) {
    fileURI = video.uri;
  } else {
    fileURI =
      'https://firebasestorage.googleapis.com/v0/b/trainify-app-firebase.appspot.com/o/videos%2Fy2mate.com.mp4?alt=media&token=a567aa95-2423-496a-977d-cc496f6140f6';
  }
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');

  useEffect(() => {
    console.log('filePath in ServePracticeVideoPlayerContainer: ', fileURI);
  }, [fileURI]);

  const onSeek = seek => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = playerState => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = data => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = data => setIsLoading(true);

  const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    alert('Exit full screen');
  };

  const enterFullScreen = () => {};

  const onFullScreen = () => {
    setIsFullScreen(isFullScreen);
    if (screenType == 'content') setScreenType('cover');
    else setScreenType('content');
  };

  useEffect(() => {
    if (video) {
      console.log('video, ', video);
    }
  }, [video]);

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = currentTime => setCurrentTime(currentTime);

  const handleShowGraphButton = () => {
    navigation.navigate('RenderGraphScreen', {
      analysis_data: video.analysisData,
    });
  };

  const renderGraphButton = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
        onTouchEnd={handleShowGraphButton}>
        <Text>Graph</Text>
      </View>
    );
  };

  const renderBackButton = () => {
    return (
      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image source={backIcon} style={{width: 32, height: 32}} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <HeaderWithText
        text={'Trainify Recorded Video'}
        hideProfileSection={true}
        navigation={navigation}
      />
      <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={paused}
        ref={videoPlayer}
        resizeMode={screenType}
        onFullScreen={isFullScreen}
        source={{
          uri: fileURI,
        }}
        style={styles.mediaPlayer}
        volume={10}
      />
      <MediaControls
        duration={duration}
        isLoading={isLoading}
        mainColor="#333"
        onFullScreen={onFullScreen}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        playerState={playerState}
        progress={currentTime}
        toolbar={renderToolbar()}
      />
      {renderGraphButton()}
      {renderBackButton()}
    </View>
  );
};

export default ServePracticeVideoPlayerContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  cameraTypeSwitcher: {
    position: 'absolute',
    top: 24,
    right: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 24,
    left: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
});
