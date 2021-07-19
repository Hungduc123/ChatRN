import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../styles/styles";

export default function Loading({ name }) {
  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <Text>Đang {name}, vui lòng chờ</Text>
      <ActivityIndicator size="large" color="skyblue" />
    </View>
  );
}
