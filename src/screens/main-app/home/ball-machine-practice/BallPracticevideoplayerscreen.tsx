// import React in our code
import React, {useState, useRef, useEffect} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';

// Import React Native Video to play video
import Video from 'react-native-video';

// Media Controls to control Play/Pause/Seek and full screen
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {SCREEN_WIDTH} from '../../../../constants';
import {IconButton} from '../../../../components/buttons';
import ScreenWrapperWithHeader from '../../../../components/wrappers/screen_wrapper_with_header';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

const graphIcon = require('../../../../assets/images/graphIcon.png');

const BallPracticeVideoPlayer = ({navigation, route}) => {
  useKeepAwake();
  const {video} = route.params;
  console.log('video, ', video);
  let fileURI = '';
  if (video && video.uri) {
    fileURI = video.uri;
  } else {
    fileURI =
      'https://firebasestorage.googleapis.com/v0/b/trainify-app-firebase.appspot.com/o/videos%2Fy2mate.com.mp4?alt=media&token=a567aa95-2423-496a-977d-cc496f6140f6';
  }

  let videoURL = video.videoURL;

  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');
  const [date, setDate] = useState('');

  const onSeek = seek => {
    videoPlayer.current.seek(seek);
  };

  const onPaused = playerState => {
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = data => {
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
      const dateTimeArray = video.timestamp.split(',');
      setDate(dateTimeArray[0]);
    }
  }, [video]);

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = currentTime => setCurrentTime(currentTime);

  const handleShowGraphButton = () => {
    navigation.navigate('BallPracticeRenderGraphScreen', {
      analysis_data: video.analysisData,
    });
  };

  const renderGraphButton = () => {
    return (
      <SafeAreaView>
        <IconButton
          styles={styles.recordIcon}
          icon={graphIcon}
          onPress={handleShowGraphButton}
          transparent={true}
        />
      </SafeAreaView>
    );
  };

  return (
    <ScreenWrapperWithHeader title={date} navigation={navigation} route={route}>
      <View
        style={{
          minHeight: (SCREEN_WIDTH / 100) * 76.8,
        }}>
        <View
          style={{
            paddingBottom: (SCREEN_WIDTH / 100) * 74.8,
          }}>
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
              uri: videoURL,
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
        </View>
      </View>
    </ScreenWrapperWithHeader>
  );
};

export default BallPracticeVideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    // minHeight: 48,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
  },
  toolbar: {
    marginTop: 0,
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
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  recordIcon: {
    width: 60,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 2,
    position: 'absolute',
    top: 10,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderColor: '#008EC1',
    borderRadius: 6,
    zIndex: 100,
  },
});
