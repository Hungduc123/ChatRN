import { Card } from "native-base";
import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../../styles/styles";
import moment from "moment";

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
      <View
        style={{
          width: "100%",
          height: 200,

          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Text>Cập nhật vào:</Text>
          <Text>{moment(data.Data).format("MMMM Do YYYY, h:mm:ss a")}</Text>
        </View>
        <View style={{ flex: 3, flexDirection: "row" }}>
          <Card style={styles.tab}>
            <Image
              source={require("../../assets/group_2093.png")}
              style={{
                width: "40%",
                height: "40%",
                resizeMode: "contain",
                padding: 10,
              }}
            />
            <Text style={{ fontSize: 20, color: "#563CCF" }}>
              {data.Confirmed}
            </Text>
            <Text>Số ca nhiễm</Text>
          </Card>
          <Card style={styles.tab}>
            <Image
              source={require("../../assets/group_2234.png")}
              style={{
                width: "40%",
                height: "40%",
                resizeMode: "contain",
                padding: 10,
              }}
            />
            <Text style={{ fontSize: 20, color: "green" }}>
              {data.Recovered}
            </Text>

            <Text>Số ca hồi phục</Text>
          </Card>
          <Card style={styles.tab}>
            <Image
              source={require("../../assets/group_2238.png")}
              style={{
                width: "40%",
                height: "40%",
                resizeMode: "contain",
                padding: 10,
              }}
            />
            <Text style={{ fontSize: 20, color: "red" }}>{data.Deaths}</Text>

            <Text>Số ca tử vong</Text>
          </Card>
        </View>
      </View>
    </Card>
  );
}
