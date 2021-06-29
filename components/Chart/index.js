import React, { useState, useEffect } from "react";
import { Card } from "native-base";

import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import HighchartsReactNative from "@highcharts/highcharts-react-native";
import moment from "moment";
const generateOptions = (data, slug) => {
  const categories = data.map((item) =>
    moment(item.updated_at).format("DD/MM/YYYY")
  );

  return {
    chart: {
      height: 400,
    },
    title: {
      text: `Tổng ca nhiễm của ${slug}`,
    },
    xAxis: { categories: categories, crosshair: true },
    colors: ["#F3585B"],
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    series: [
      {
        name: `Tổng ca nhiễm của ${slug}`,
        data: data.map((item) => item.confirmed),
      },
    ],
    tooltip: {
      // HeaderFormat: <Text>{point.key}</Text>,
      // pointFormat: "<Text>{series.name: } {point.y} ca</Text>",
      // footerFormat: "</table>",
      formatter: function () {
        return this.key + "-Ca nhiễm: " + this.y + " ca";
      },
    },
    shared: true,
    useHtml: true,
  };
};
export default function LineChart({ data, slug }) {
  const [options, setOptions] = useState({});
  const [reportType, setReportType] = useState("all");

  useEffect(() => {
    let customData = [];
    switch (reportType) {
      case "all":
        customData = data;
        break;
      case "30day":
        customData = data.slice(data.length - 30);
        break;
      case "7day":
        customData = data.slice(data.length - 7);
        break;

      default:
        customData = data;
        break;
    }
    setOptions(generateOptions(customData, slug));
  }, [data, reportType, slug]);
  return (
    <View style={[styles.container, { borderRadius: 15 }]}>
      <Card style={{ flexDirection: "row", padding: 10, borderRadius: 15 }}>
        <TouchableOpacity
          onPress={() => {
            setReportType("all");
          }}
          style={[
            styles.Buttons,
            { backgroundColor: reportType === "all" ? "#FA4A0C" : "white" },
          ]}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setReportType("7day");
          }}
          style={[
            styles.Buttons,
            { backgroundColor: reportType === "7day" ? "#FA4A0C" : "white" },
          ]}
        >
          <Text>7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setReportType("30day");
          }}
          style={[
            styles.Buttons,
            { backgroundColor: reportType === "30day" ? "#FA4A0C" : "white" },
          ]}
        >
          <Text>30 Days</Text>
        </TouchableOpacity>
      </Card>
      <Card style={[styles.container, { borderRadius: 15 }]}>
        <HighchartsReactNative styles={styles.container} options={options} />
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 550,
    backgroundColor: "#fff",
    justifyContent: "center",
    flex: 1,
  },
  Buttons: {
    height: 50,
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#FA4A0C",
    borderRadius: 10,
  },
});
