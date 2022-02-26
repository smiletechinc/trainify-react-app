import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 8) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 5, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
};

export default function RenderGraphScreen({navigation, route}) {
    const { graphData } = route.params;
console.log('graphData 1', graphData);
console.log('graphData.labels ', graphData.labels)
    const [data, setData] = useState(graphData);

useEffect(() => {
    console.log('graphData ',graphData);
    // const analysisData = JSON.parse(graphData);
    // console.log('analysisData 1', analysisData);
    // setData(JSON.parse(analysisData));
}, [graphData]);


const temp_analysis_data = {
        labels: ["Flat", "Kick", "Slice"],
    legend: ["Grade A", "Grade B", "Grade C", "Grade D"],
    data: [
      [1, 1, 1, 1],
      [1, 1, 1, 6],
      [1, 1, 1, 4],
    ],
    barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
}

//   const analysis_data = {
//     labels: ["Flat", "Kick", "Slice"],
//     legend: ["Grade A", "Grade B", "Grade C", "Grade D"],
//     data: [
//       [2, 3, 4, 1],
//       [1, 5, 5, 6],
//       [0, 2, 6, 4],
//     ],
//     barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
//   };

  return (
    <View style={styles.container}>
      {data && <StackedBarChart
        // style={graphStyle}
        data={graphData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
