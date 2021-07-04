import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import HighMaps from "../Chart/HighMaps";
import LineChartMini from "../LineChartMini";
import { RootStackParamList } from "../RootStackParamList";
type DataInVietNamScreenProp = StackNavigationProp<
  RootStackParamList,
  "KhaiBaoYTe"
>;
export default function DataInVietNam() {
  const navigation = useNavigation<DataInVietNamScreenProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Dữ liệu chi tiết tại Việt Nam",
    });
  }, [navigation]);
  const data = useSelector((state: any) => state.DataInVietNam);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        <LineChartMini
          colorLineChart={"green"}
          data={data.cakhoi}
          titleTable="Ca Khỏi"
        ></LineChartMini>

        <LineChartMini
          colorLineChart={"red"}
          data={data.canhiem}
          titleTable="Ca nhiễm"
        ></LineChartMini>

        <LineChartMini
          colorLineChart={"gray"}
          data={data.catuvong}
          titleTable="Ca tử vong"
        ></LineChartMini>
      </View>

      <HighMaps></HighMaps>
    </ScrollView>
  );
}
