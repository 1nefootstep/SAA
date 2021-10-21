import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

export interface MenuButtonProps {
  navigation: any;
}

export default function MenuButton(props: MenuButtonProps) {
  return (
    <TouchableOpacity
      style={styles.menuIcon}
      onPress={() => props.navigation.toggleDrawer()}
    >
      <Ionicons name="menu" size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 2,
    flex: 1,
    position: "absolute",
    margin: 20,
  },
});
