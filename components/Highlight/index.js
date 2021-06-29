import { Card } from "native-base";
import React from "react";
import { View, Text } from "react-native";

export default function Highlight({ report }) {
  const data = report && report.length ? report[report.length - 1] : [];

  return (
    <Card
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
      }}
    >
      <Text>Số ca nhiễm: {data.Confirmed}</Text>

      <Text>Số ca khỏi: {data.Recovered}</Text>
      <Text>Số ca tử vong: {data.Deaths}</Text>
    </Card>
  );
}
