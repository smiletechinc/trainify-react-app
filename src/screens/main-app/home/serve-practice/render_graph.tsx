import React, {useState, useRef, useEffect} from 'react';
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
import {reactHooksModuleName} from '@reduxjs/toolkit/dist/query/react/module';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {TouchableOpacity} from 'react-native-gesture-handler/lib/typescript/components/touchables';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function ServePracticeRenderGraphScreen({navigation, route}) {
  // Data coming from Firebase
  const {analysis_data} = route.params;

  // Data Format that Victory Graph Receives
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

  const pie_data = {
    data: [
      {x: 'Flat', y: flatServes, label: `Flat: ${flatServes}`},
      {x: 'Kick', y: kickServes, label: `Kick: ${kickServes}`},
      {x: 'Slice', y: sliceServes, label: `Slice: ${sliceServes}`},
    ],
  };

  // Converting the Data Received from Firebase to the Format that Victory Graph Accepts to form Graph
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

  // console.log(data_victory.AGrade[1].y, analysis_data["data"][1][0]);

  // const renderGraphButton = () => {
  //   return (
  //     <SafeAreaView
  //       style={styles.cameraTypeSwitcher}
  //       onTouchEnd={handleShowGraphButton}>
  //       <Text>Show graph</Text>
  //     </SafeAreaView>
  //   );
  // };

  // const renderBackButton = () => {
  //   return (
  //     <TouchableOpacity
  //       // style={styles.backButtonContainer}
  //       onPress={() => {
  //         navigation.goBack();
  //       }}>
  //       {/* <Image source={backIcon} style={{width: 24, height: 24}} /> */}
  //     </TouchableOpacity>
  //   );
  // };

  return (
    // Graph Printing
    <View style={styles.container}>
      <HeaderWithText
        text="Graph"
        hideProfileSection={true}
        navigation={navigation}
      />
      <View style={styles.pieContainer}>
        <VictoryPie
          animate={{
            duration: 1000,
          }}
          padding={screenWidth / 4}
          width={screenWidth}
          height={screenHeight}
          colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
          data={pie_data.data}
        />
      </View>
      <Text>Distibution of Serves Performed</Text>
      <View style={styles.vectorContainer}>
        <VictoryChart domainPadding={screenWidth / 8} width={screenWidth}>
          <VictoryAxis
            dependentAxis
            label={'Total Serves'}
            style={{axisLabel: {padding: 30}}}></VictoryAxis>
          <VictoryAxis label={'Type of Serve'}></VictoryAxis>
          <VictoryGroup offset={screenWidth / 25}>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.AGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'blue'}, labels: {fill: 'white'}}}
              labelComponent={<VictoryLabel dy={20} />}></VictoryBar>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.BGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'orange'}, labels: {fill: 'white'}}}
              labelComponent={<VictoryLabel dy={20} />}></VictoryBar>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.CGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'red'}, labels: {fill: 'white'}}}
              labelComponent={<VictoryLabel dy={20} />}></VictoryBar>
            <VictoryBar
              animate={{
                duration: 2000,
              }}
              data={data_victory.DGrade}
              labels={({datum}) => datum.y}
              style={{data: {fill: 'green'}, labels: {fill: 'white'}}}
              labelComponent={<VictoryLabel dy={20} />}></VictoryBar>
          </VictoryGroup>
          <VictoryLegend
            x={screenWidth / 30}
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
