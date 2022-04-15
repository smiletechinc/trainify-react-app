import React, {FunctionComponent} from 'react';
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
} from 'victory-native';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {SafeAreaView} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCREEN_WIDTH} from '../../../../constants';
import ScreenWrapperWithHeader from './../../../../components/wrappers/screen_wrapper_with_header';

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

type Props = {
  navigation: any;
  route: any;
};

const BallPracticeRenderGraphScreen: FunctionComponent<Props> = props => {
  const {navigation, route} = props;
  const {analysis_data} = route.params;

  console.log('Graph Screen: ', analysis_data);

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

  console.log(flatServes);

  const pie_data = {
    data: [
      {x: 'Flat', y: flatServes, label: `Forehand: ${flatServes}`},
      {x: 'Kick', y: kickServes, label: `Backhand: ${kickServes}`},
    ],
  };

  data_victory.AGrade[0].y = analysis_data['data'][0][0];
  // data_victory.AGrade[1].y = analysis_data['data'][1][0];

  data_victory.BGrade[0].y = analysis_data['data'][1][0];
  // data_victory.BGrade[1].y = analysis_data['data'][1][1];

  return (
    <ScreenWrapperWithHeader
      title="Volley / Ball Machine Analysis"
      navigation={navigation}
      route={route}>
      <View style={styles.container}>
        <View style={styles.pieContainer}>
          <VictoryPie
            animate={{
              duration: 1000,
            }}
            padding={screenWidth / 3.48}
            width={screenWidth}
            height={screenHeight / 2}
            colorScale={['tomato', 'orange', 'gold']}
            data={pie_data.data}
          />
        </View>
        <View style={{marginTop: -140}}>
          <Text>Rally Length Breakdown</Text>
        </View>
        <View style={styles.vectorContainer}>
          <VictoryChart domainPadding={screenWidth / 4} width={screenWidth}>
            <VictoryAxis
              dependentAxis
              domain={{y: [0, 8]}}
              label={'Total Rally Returns'}
              style={{axisLabel: {padding: 26}}}></VictoryAxis>
            <VictoryAxis label={'Type of Return'}></VictoryAxis>
            <VictoryGroup offset={screenWidth / 8}>
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
            {/* <VictoryLegend
              width={screenWidth / 80}
              x={screenWidth / 4}
              orientation={'horizontal'}
              gutter={screenWidth / 10}
              data={[
                {name: 'Picked', symbol: {fill: 'blue'}},
                {name: 'Missed', symbol: {fill: 'orange'}},
              ]}></VictoryLegend> */}
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
    height: screenHeight / 2,
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
