import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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

export default function BallPracticeRenderGraphScreen({navigation, route}) {
  const {analysis_data} = route.params;
  // console.log('graphData 1', graphData);
  // console.log('graphData.labels ', graphData.labels)
  //     const [data, setData] = useState(graphData);

  // useEffect(() => {
  //     console.log('graphData ',graphData);
  //     // const analysisData = JSON.parse(graphData);
  //     // console.log('analysisData 1', analysisData);
  //     // setData(JSON.parse(analysisData));
  // }, [graphData]);

  // const temp_analysis_data = {
  //         labels: ["Flat", "Kick", "Slice"],
  //     legend: ["Grade A", "Grade B", "Grade C", "Grade D"],
  //     data: [
  //       [1, 1, 1, 1],
  //       [1, 1, 1, 6],
  //       [1, 1, 1, 4],
  //     ],
  //     barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
  // }

  // const analysis_data = {
  //   labels: ['Flat', 'Kick', 'Slice'],
  //   legend: ['Grade A', 'Grade B', 'Grade C', 'Grade D'],
  //   data: [
  //     [2, 3, 4, 1],
  //     [1, 5, 5, 6],
  //     [0, 2, 6, 4],
  //   ],
  //   barColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
  // };

  console.log('Graph Screen: ', analysis_data);

  // Data Format that Victory Graph Receives
  const data_victory = {
    AGrade: [
      {x: 'Forehand', y: 30},
      {x: 'Backhand', y: 20},
    ],
    BGrade: [
      {x: 'Forehand', y: 50},
      {x: 'Backhand', y: 80},
    ],
    CGrade: [
      {x: 'Forehand', y: 10},
      {x: 'Backhand', y: 60},
    ],
    DGrade: [
      {x: 'Forehand', y: 20},
      {x: 'Backhand', y: 30},
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
      {x: 'Forehand', y: flatServes, label: `Forehand: ${flatServes}`},
      {x: 'Backhand', y: kickServes, label: `Backhand: ${kickServes}`},
    ],
  };

  // Converting the Data Received from Firebase to the Format that Victory Graph Accepts to form Graph
  data_victory.AGrade[0].y = analysis_data['data'][0][0];
  data_victory.AGrade[1].y = analysis_data['data'][1][0];

  data_victory.BGrade[0].y = analysis_data['data'][0][1];
  data_victory.BGrade[1].y = analysis_data['data'][1][1];

  data_victory.CGrade[0].y = analysis_data['data'][0][2];
  data_victory.CGrade[1].y = analysis_data['data'][1][2];

  data_victory.DGrade[0].y = analysis_data['data'][0][3];
  data_victory.DGrade[1].y = analysis_data['data'][1][3];

  // console.log(data_victory.AGrade[1].y, analysis_data["data"][1][0]);

  return (
    // Graph Printing
    <View style={styles.container}>
      <View style={styles.pieContainer}>
        <VictoryPie
          animate={{
            duration: 1000,
          }}
          padding={screenWidth / 4}
          width={screenWidth}
          height={screenHeight}
          colorScale={['tomato', 'orange', 'gold']}
          data={pie_data.data}
        />
      </View>
      <Text>Distibution of Serves Performed</Text>
      <View style={styles.vectorContainer}>
        <VictoryChart domainPadding={screenWidth / 4}>
          <VictoryAxis
            domain={{y: [0, 8]}}
            dependentAxis
            label={'Total Returns'}
            style={{axisLabel: {padding: 30}}}></VictoryAxis>
          <VictoryAxis label={'Type of Return'}></VictoryAxis>
          <VictoryGroup offset={screenWidth / 25}>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.AGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'blue'}, labels: {fill: 'blue'}}}
              labelComponent={<VictoryLabel dy={0} />}></VictoryBar>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.BGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'orange'}, labels: {fill: 'orange'}}}
              labelComponent={<VictoryLabel dy={0} />}></VictoryBar>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.CGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'red'}, labels: {fill: 'red'}}}
              labelComponent={<VictoryLabel dy={0} />}></VictoryBar>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.DGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'green'}, labels: {fill: 'green'}}}
              labelComponent={<VictoryLabel dy={0} />}></VictoryBar>
          </VictoryGroup>
          <VictoryLegend
            x={Dimensions.get('screen').width / 30}
            orientation={'horizontal'}
            gutter={screenWidth / 20}
            data={[
              {name: 'A Grade', symbol: {fill: 'blue'}},
              {name: 'B Grade', symbol: {fill: 'orange'}},
              {name: 'C Grade', symbol: {fill: 'red'}},
              {name: 'D Grade', symbol: {fill: 'green'}},
            ]}></VictoryLegend>
        </VictoryChart>
      </View>
    </View>
    // <View style={styles.container}>
    //   {data && (
    //     <StackedBarChart
    //       // style={graphStyle}
    //       data={graphData}
    //       width={screenWidth}
    //       height={220}
    //       chartConfig={chartConfig}
    //     />
    //   )}
    //   <StatusBar style="auto" />
    // </View>
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
  pieContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vectorContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
