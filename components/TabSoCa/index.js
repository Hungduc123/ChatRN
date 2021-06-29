import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/styles";

export default function TabSoCa({
  soNhiem,
  soDangDieuTri,
  soHoiPhuc,
  soTuVong,
}) {
  return (
    <View style={styles.container}>
      <Text>Số ca nhiễm : {soNhiem}</Text>
      <Text>Số ca đã hồi phục {soHoiPhuc} </Text>
      <Text>Số ca đang điều trị {soDangDieuTri}</Text>
      <Text>Số ca tử vong {soTuVong}</Text>
    </View>
  );
}
