import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import Constants from "expo-constants";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Text as TextSVG } from "react-native-svg";

import MenuButton from "../components/MenuButton";
import { Text, View } from "../components/Themed";
import { default as AKB } from "../state_management/AnnotationKnowledgeBank";

export default function TabThreeScreen({ navigation }) {
  const [result, setResult] = React.useState<AKB.ComputedResult>({
    averageVelocities: [],
    strokeFrequencies: [],
    strokeLengths: [],
    distanceToTimeMap: [],
  });

  const getPoints = (a: Array<AKB.DataAndTimeRange>) => {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      const curr = a[i];
      if (curr.hasData) {
        const x = 2 * i;
        result.push({ x: x, y: curr.data.toFixed(3) });
        result.push({ x: x + 1, y: curr.data.toFixed(3) });
      }
    }
  };

  return (
    <View style={styles.container}>
      <MenuButton navigation={navigation} />
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <TouchableOpacity
          style={styles.updateResultButton}
          onPress={() => {
            setResult(AKB.computeResult());
            console.log(result);
          }}
        >
          <Text>Update result</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {result.averageVelocities.map((e, i) => {
            return (
              <Text key={i}>
                Average velocity #{i}: {e.hasData ? e.data.toFixed(3) : ""}m/s
              </Text>
            );
          })}
          <Text>{"\n"}</Text>
          {result.strokeFrequencies.map((e, i) => {
            return (
              <Text key={i}>
                Stroke freq #{i}: {e.hasData ? e.data.toFixed(3) : ""}stroke/s
              </Text>
            );
          })}
          <Text>{"\n"}</Text>
          {result.strokeLengths.map((e, i) => {
            return (
              <Text key={i}>
                Stroke lengths #{i}: {e.hasData ? e.data.toFixed(3) : ""}
                m/stroke
              </Text>
            );
          })}
          {result.averageVelocities.length > 0 && (
            <View>
              <Text>Velocity Chart</Text>
              <LineChart
                data={{
                  labels: result.distanceToTimeMap.map((e) =>
                    e.distance.toString()
                  ),
                  datasets: [
                    {
                      data: result.averageVelocities
                        .map((e) => (e.hasData ? e.data : 0))
                        .concat([0]),
                    },
                  ],
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix="m/s"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                renderDotContent={({ x, y, index, indexData }) => (
                  <TextSVG key={index} x={x + 10} y={y} fill="black">
                    {indexData.toFixed(3)}m/s
                  </TextSVG>
                )}
                style={{
                  marginVertical: 8,

                  borderRadius: 16,
                }}
              />
            </View>
          )}
          {result.strokeLengths.length > 0 &&
            result.strokeLengths.length === result.averageVelocities.length && (
              <View>
                <Text>Stroke Length Chart</Text>
                <LineChart
                  data={{
                    labels: result.distanceToTimeMap.map((e) =>
                      e.distance.toString()
                    ),
                    datasets: [
                      {
                        data: result.strokeLengths
                          .map((e) => (e.hasData ? e.data : 0))
                          .concat([0]),
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width} // from react-native
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="m"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726",
                    },
                  }}
                  renderDotContent={({ x, y, index, indexData }) => (
                    <TextSVG key={index} x={x + 10} y={y} fill="black">
                      {indexData.toFixed(3)}m
                    </TextSVG>
                  )}
                  style={{
                    marginVertical: 8,

                    borderRadius: 16,
                  }}
                />
              </View>
            )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  resultContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuIcon: {
    zIndex: 1,
    flex: 1,
    position: "absolute",
    margin: 20,
  },
  updateResultButton: {
    zIndex: 20,
    // flex: 1,
    // position: "absolute",
    padding: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
