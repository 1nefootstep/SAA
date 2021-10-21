import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as React from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import MenuButton from "../components/MenuButton";
import { Text, View } from "../components/Themed";
import { formatTimeFromPosition } from "../components/TimeFormattingUtil";
import { default as AKB } from "../state_management/AnnotationKnowledgeBank";

export default function TabThreeScreen({ navigation }) {
  const [result, setResult] = React.useState<AKB.ComputedResult>({
    averageVelocities: [],
    strokeFrequencies: [],
    strokeLengths: [],
  });
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
                Stroke lengths #{i}: {e.hasData ? e.data.toFixed(3) : ""}m/stroke
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
    flex: 1,
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
