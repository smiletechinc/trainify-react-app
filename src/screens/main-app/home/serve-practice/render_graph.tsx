import {StyleSheet, Text, View, Platform} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
  VictoryPie,
} from 'victory-native';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {SafeAreaView} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCREEN_WIDTH} from '../../../../constants';
import ScreenWrapperWithHeader from '../../../../components/wrappers/screen_wrapper_with_header';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

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

export default function ServePracticeRenderGraphScreen({navigation, route}) {
  // Data coming from Firebase
  const {analysis_data} = route.params;

  const data_victory = {
    AGrade: [
      {x: 'Flat', y: 30},
      {x: 'Kick', y: 20},
      {x: 'Slice', y: 30},
    ],
    BGrade: [
      {x: 'Flat', y: 50},
      {x: 'Kick', y: 80},
      {x: 'Slice', y: 40},
    ],
    CGrade: [
      {x: 'Flat', y: 10},
      {x: 'Kick', y: 60},
      {x: 'Slice', y: 30},
    ],
    DGrade: [
      {x: 'Flat', y: 20},
      {x: 'Kick', y: 30},
      {x: 'Slice', y: 5},
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

  const sliceServes =
    analysis_data['data'][2][0] +
    analysis_data['data'][2][1] +
    analysis_data['data'][2][2] +
    analysis_data['data'][2][3];

  console.log(flatServes);

  var pie_data;

  if (flatServes == 0 && kickServes == 0 && sliceServes == 0) {
    pie_data = {
      data: [],
    };
  } else if (flatServes == 0 && kickServes == 0) {
    pie_data = {
      data: [{x: 'Slice', y: sliceServes, label: `Slice: ${sliceServes}`}],
    };
  } else if (sliceServes == 0 && kickServes == 0) {
    pie_data = {
      data: [{x: 'Flat', y: flatServes, label: `Flat: ${flatServes}`}],
    };
  } else if (sliceServes == 0 && flatServes == 0) {
    pie_data = {
      data: [{x: 'Kick', y: kickServes, label: `Kick: ${kickServes}`}],
    };
  } else {
    pie_data = {
      data: [
        {x: 'Flat', y: flatServes, label: `Flat: ${flatServes}`},
        {x: 'Kick', y: kickServes, label: `Kick: ${kickServes}`},
        {x: 'Slice', y: sliceServes, label: `Slice: ${sliceServes}`},
      ],
    };
  }

  // const pie_data = {
  //   data: [
  //     {x: 'Flat', y: flatServes, label: `Flat: ${flatServes}`},
  //     {x: 'Kick', y: kickServes, label: `Kick: ${kickServes}`},
  //     {x: 'Slice', y: sliceServes, label: `Slice: ${sliceServes}`},
  //   ],
  // };

  data_victory.AGrade[0].y = analysis_data['data'][0][0];
  data_victory.AGrade[1].y = analysis_data['data'][1][0];
  data_victory.AGrade[2].y = analysis_data['data'][2][0];

  data_victory.BGrade[0].y = analysis_data['data'][0][1];
  data_victory.BGrade[1].y = analysis_data['data'][1][1];
  data_victory.BGrade[2].y = analysis_data['data'][2][1];

  data_victory.CGrade[0].y = analysis_data['data'][0][2];
  data_victory.CGrade[1].y = analysis_data['data'][1][2];
  data_victory.CGrade[2].y = analysis_data['data'][2][2];

  data_victory.DGrade[0].y = analysis_data['data'][0][3];
  data_victory.DGrade[1].y = analysis_data['data'][1][3];
  data_victory.DGrade[2].y = analysis_data['data'][2][3];

  console.log('DataVictory.AGrade', data_victory.AGrade);

  return (
    <ScreenWrapperWithHeader
      title="Serve Practice Analysis"
      navigation={navigation}
      route={route}>
      <View style={styles.container}>
        <View style={styles.pieContainer}>
          <VictoryPie
            animate={{
              duration: 1000,
            }}
            padding={screenWidth / 3.9}
            width={screenWidth}
            height={screenHeight / 2}
            colorScale={['gold', 'cyan', 'gray']}
            data={pie_data.data}
          />
        </View>
        <View style={{marginTop: -120}}>
          <Text>Distibution of Serves Performed</Text>
        </View>
        <View style={styles.vectorContainer}>
          <VictoryChart domainPadding={screenWidth / 4}>
            <VictoryAxis
              domain={{y: [0, 8]}}
              dependentAxis
              label={'Total Serves'}
              style={{
                axisLabel: {paddingRight: 50, paddingLeft: 10},
              }}></VictoryAxis>
            <VictoryAxis label={'Type of Serve'}></VictoryAxis>
            <VictoryGroup offset={screenWidth / 25}>
              <VictoryBar
                animate={{
                  duration: 2000,
                }}
                data={data_victory.AGrade}
                labels={({datum}) => datum.y}
                style={{data: {fill: 'blue'}, labels: {fill: 'white'}}}
                labelComponent={<VictoryLabel dy={14} />}></VictoryBar>
              <VictoryBar
                animate={{
                  duration: 2000,
                }}
                data={data_victory.BGrade}
                labels={({datum}) => datum.y}
                style={{data: {fill: 'orange'}, labels: {fill: 'white'}}}
                labelComponent={<VictoryLabel dy={14} />}></VictoryBar>
              <VictoryBar
                animate={{
                  duration: 2000,
                }}
                data={data_victory.CGrade}
                labels={({datum}) => datum.y}
                style={{data: {fill: 'red'}, labels: {fill: 'white'}}}
                labelComponent={<VictoryLabel dy={14} />}></VictoryBar>
              <VictoryBar
                animate={{
                  duration: 2000,
                }}
                data={data_victory.DGrade}
                labels={({datum}) => datum.y}
                style={{data: {fill: 'green'}, labels: {fill: 'white'}}}
                labelComponent={<VictoryLabel dy={14} />}></VictoryBar>
            </VictoryGroup>
            <VictoryLegend
              x={Dimensions.get('screen').width / 30}
              orientation={'horizontal'}
              gutter={screenWidth / 25}
              data={[
                {name: 'A Grade', symbol: {fill: 'blue'}},
                {name: 'B Grade', symbol: {fill: 'orange'}},
                {name: 'C Grade', symbol: {fill: 'red'}},
                {name: 'D Grade', symbol: {fill: 'green'}},
              ]}></VictoryLegend>
          </VictoryChart>
        </View>
      </View>
    </ScreenWrapperWithHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBar: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    minHeight: 48,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
  },
  main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 15 : 15,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  pieContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight / 1.8,
    paddingBottom: screenHeight / 10,
  },
  vectorContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight / 1.9,
    paddingLeft: screenWidth / 20,
  },

  calibrationContainer: {
    position: 'absolute',
    top: 10,
    left: 100,
    width: 200,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
    marginTop: 16,
  },
});
