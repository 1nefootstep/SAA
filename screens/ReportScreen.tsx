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
import { default as AKB } from "../state_management/AKB/AnnotationKnowledgeBank";
import {
  ComputedResult,
  computeResult,
} from "../state_management/StatisticsCalculator";
import { formatTimeFromPosition } from "../components/TimeFormattingUtil";

export default function ReportScreen({ navigation }) {
  const [result, setResult] = React.useState<ComputedResult>({
    averageVelocities: new Map(),
    strokeRates: new Map(),
    strokeCounts: new Map(),
    distanceToTimeMap: new Map(),
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
            setResult(computeResult());
            console.log(result);
          }}
        >
          <Text>Update result</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {Array.from(result.distanceToTimeMap.entries()).map((e, i) => {
            return (
              <Text key={i}>
                {e[0]}m: {formatTimeFromPosition(e[1])}s
              </Text>
            );
          })}
          <Text>{"\n"}</Text>
          {Array.from(result.averageVelocities.entries()).map((e, i) => {
            return (
              <Text key={i}>
                Velocity {e[0]}m: {e[1].toFixed(2)}m/s
              </Text>
            );
          })}
          <Text>{"\n"}</Text>
          {Array.from(result.strokeCounts.entries()).map((e, i) => {
            return (
              <Text key={i}>
                SC {e[0]}m: {e[1].toFixed(2)} strokes
              </Text>
            );
          })}
          <Text>{"\n"}</Text>
          {Array.from(result.strokeRates.entries()).map((e, i) => {
            return (
              <Text key={i}>
                SR {e[0]}m: {e[1].toFixed(2)} strokes/min
              </Text>
            );
          })}
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
