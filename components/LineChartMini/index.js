import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import HighchartsReactNative from "@highcharts/highcharts-react-native";

const generateOptions = (data, titleTable, colorLineChart) => {
  const categories = data.map((item) => item.day);

  return {
    chart: {
      height: 300,
    },
    title: {
      text: titleTable,
    },
    xAxis: { categories: categories, crosshair: true },
    colors: [colorLineChart],
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    series: [
      {
        name: titleTable,
        data: data.map((item) => item.quantity),
      },
    ],
    tooltip: {
      // HeaderFormat: <Text>{point.key}</Text>,
      // pointFormat: "<Text>{series.name: } {point.y} ca</Text>",
      // footerFormat: "</table>",
      formatter: function () {
        return this.key + " " + this.y + " ca";
      },
    },
    shared: true,
    useHtml: true,
  };
};
export default function LineChartMini({ data, titleTable, colorLineChart }) {
  const [options, setOptions] = useState({});

  useEffect(() => {
    setOptions(generateOptions(data, titleTable, colorLineChart));
  }, [data, titleTable, colorLineChart]);
  return (
    <View style={styles.container}>
      <HighchartsReactNative styles={styles.container} options={options} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: "#fff",
    justifyContent: "center",
    flex: 1,
  },
});
