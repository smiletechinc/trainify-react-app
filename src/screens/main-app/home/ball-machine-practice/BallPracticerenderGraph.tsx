import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {Dimensions} from 'react-native';
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
  VictoryPie,
  Border,
} from 'victory-native';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {SafeAreaView} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCREEN_WIDTH} from '../../../../constants';
import ScreenWrapperWithHeader from './../../../../components/wrappers/screen_wrapper_with_header';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

var screenHeight = Dimensions.get('window').width;
var screenWidth = Dimensions.get('window').height;

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 8) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 5, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
};

type Props = {
  navigation: any;
  route: any;
};

const BallPracticeRenderGraphScreen: FunctionComponent<Props> = props => {
  useKeepAwake();
  const {navigation, route} = props;
  const {analysis_data} = route.params;
  const [pieGraphContainerLength, setPieGraphContainerLength] = useState(
    screenWidth * 0.5,
  );
  const [victoryChartContainerLength, setVicotryChartContainterLength] =
    useState(screenWidth * 0.5);

  console.log('analysis_data: ', analysis_data);

  const data_victory = {
    AGrade: [
      {x: 'Forehand Return', y: 30},
      // {x: 'Backhand Return', y: 20},
    ],
    BGrade: [
      // {x: 'Forehand Return', y: 50},
      {x: 'Backhand Return', y: 80},
    ],
  };

  const flatServes =
    analysis_data['data'][0][0] +
    analysis_data['data'][0][1] +
    analysis_data['data'][0][2] +
    analysis_data['data'][0][3];

  const kickServes =
    analysis_data['data'][1][0] +
    analysis_data['data'][1][1] +
    analysis_data['data'][1][2] +
    analysis_data['data'][1][3];

  console.log('flatServes, ', flatServes);

  const pie_data = {
    data: [
      {x: 'Flat', y: flatServes, label: `Forehand: ${flatServes}`},
      {x: 'Kick', y: kickServes, label: `Backhand: ${kickServes}`},
    ],
  };
  console.log('pie_data, ', pie_data);

  data_victory.AGrade[0].y = analysis_data['data'][0][0];
  // data_victory.AGrade[1].y = analysis_data['data'][1][0];

  data_victory.BGrade[0].y = analysis_data['data'][1][0];
  // data_victory.BGrade[1].y = analysis_data['data'][1][1];

  const onPieChartLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log('Dimensions : ', x, y, height, width);
    setPieGraphContainerLength(height < width ? height : width);
  };

  const onVictoryChartLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log('Dimensions : ', x, y, height, width);
    setVicotryChartContainterLength(height > width ? height : width);
  };

  return (
    <ScreenWrapperWithHeader
      title="Volley / Ball Machine Analysis"
      navigation={navigation}
      route={route}>
      <View style={styles.container}>
        <View style={styles.pieContainer} onLayout={onPieChartLayout}>
          <VictoryPie
            // animate={{
            //   duration: 1000,
            // }}
            padding={(screenHeight / 3.5) * 0.4}
            width={pieGraphContainerLength * 0.985}
            height={pieGraphContainerLength * 0.985}
            colorScale={['tomato', 'orange', 'gold']}
            data={pie_data.data}
          />
        </View>
        {/* <View style={{marginTop: -140}}>
          <Text>Rally Length Breakdown</Text>
        </View> */}
        <View style={styles.vectorContainer} onLayout={onVictoryChartLayout}>
          <VictoryChart
            domainPadding={victoryChartContainerLength * 0.225}
            width={victoryChartContainerLength * 0.9}>
            <VictoryAxis
              dependentAxis
              domain={{y: [0, 8]}}
              label={'Total Rally Returns'}
              style={{axisLabel: {padding: 28}}}></VictoryAxis>
            <VictoryAxis label={'Type of Return'}></VictoryAxis>
            <VictoryGroup offset={screenHeight / 20}>
              <VictoryBar
                animate={{
                  duration: 2000,
                }}
                data={data_victory.AGrade}
                labels={({datum}) => datum.y}
                style={{data: {fill: 'tomato'}, labels: {fill: 'white'}}}
                labelComponent={<VictoryLabel dy={14} />}></VictoryBar>
              <VictoryBar
                animate={{
                  duration: 2000,
                }}
                data={data_victory.BGrade}
                labels={({datum}) => datum.y}
                style={{data: {fill: 'orange'}, labels: {fill: 'white'}}}
                labelComponent={<VictoryLabel dy={14} />}></VictoryBar>
            </VictoryGroup>
          </VictoryChart>
        </View>
      </View>
    </ScreenWrapperWithHeader>
  );
};
export default BallPracticeRenderGraphScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 4,
    flexDirection: 'row',
    // borderStyle: 'solid',
    // borderWidth: 2,
    backgroundColor: '#fff',
    minHeight: screenWidth * 0.74,
    marginHorizontal: screenHeight * 0.01,
    // minWidth: screenHeight - 1000,
    zIndex: 100,
  },

  pieContainer: {
    display: 'flex',
    flex: 1,
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // height: screenHeight * 0.8,
    // borderStyle: 'dotted',
    // paddingBottom: 128,
    // marginBottom: 128,
    // height: '100%',
    // width: 'auto',
    // marginRight: screenHeight * 0.6,
    // borderWidth: 2,
    // marginTop: -18,
    // paddingBottom: screenHeight * 0.08,
    backgroundColor: 'transparent',
    // paddingLeft: 16,
    zIndex: -100,
  },
  vectorContainer: {
    display: 'flex',
    flex: 1,
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // width: screenHeight * 0.6,
    // borderStyle: 'solid',
    // borderWidth: 2,
    // height: screenHeight * 0.8,
    // marginTop: -18,
    // paddingRight: screenHeigh,
    // paddingLeft: screenHeight * 0.01,
    backgroundColor: 'transparent',
    zIndex: -100,
  },
});
