import { Card } from "native-base";
import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function Homes() {
  return (
    // <View style={{ flex: 1 }}>
    //   <View style={{ flex: 1, backgroundColor: "red" }}>
    //     <ImageBackground
    //       source={require("../../../assets/background_header.png")}
    //       style={{
    //         width: "100%",
    //         height: "100%",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       <Image
    //         source={require("../../../assets/background_bottom_navbar.png")}
    //         style={{ width: "80%", height: "20%" }}
    //       ></Image>
    //     </ImageBackground>
    //   </View>

    //   <View style={{ flex: 1, padding: 10 }}>
    //     <View
    //       style={{
    //         flex: 1,
    //         flexDirection: "row",
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       <Text>Update</Text>
    //       <Text>7/3/2021</Text>
    //     </View>
    //     <View style={{ flex: 3, flexDirection: "row" }}>
    //       <Card style={styles.tab}>
    //         <Text>number</Text>
    //         <Image
    //           source={require("../../../assets/group_2093.png")}
    //           style={{ width: "30%", height: "30%", padding: 10 }}
    //         />
    //       </Card>
    //       <Card style={styles.tab}>
    //         <Text>number</Text>
    //       </Card>
    //       <Card style={styles.tab}>
    //         <Text>number</Text>
    //       </Card>
    //     </View>
    //   </View>
    //   <View style={{ flex: 1 }}></View>
    //   <View style={{ flex: 1 }}></View>
    // </View>
    <ScrollView>
      <ImageBackground
        source={require("../../../assets/background_header.png")}
        style={{
          width: "100%",
          height: 150,
          justifyContent: "center",
          //   alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>Fight Covid-19</Text>
          <Image
            source={require("../../../assets/vector_ek1.png")}
            style={{ width: 20, height: 20 }}
          />
        </View>
        <Image
          source={require("../../../assets/background_bottom_navbar.png")}
          style={{ width: "80%", height: "20%", left: 20 }}
        />
      </ImageBackground>
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
          <Text>Update</Text>
          <Text>7/3/2021</Text>
        </View>
        <View style={{ flex: 3, flexDirection: "row" }}>
          <Card style={styles.tab}>
            <Image
              source={require("../../../assets/group_2093.png")}
              style={{
                width: "40%",
                height: "40%",
                resizeMode: "contain",
                padding: 10,
              }}
            />
            <Text style={{ fontSize: 20, color: "blue" }}>number</Text>
            <Text>number</Text>
          </Card>
          <Card style={styles.tab}>
            <Image
              source={require("../../../assets/group_2234.png")}
              style={{
                width: "40%",
                height: "40%",
                resizeMode: "contain",
                padding: 10,
              }}
            />
            <Text style={{ fontSize: 20, color: "green" }}>number</Text>

            <Text>number</Text>
          </Card>
          <Card style={styles.tab}>
            <Image
              source={require("../../../assets/group_2238.png")}
              style={{
                width: "40%",
                height: "40%",
                resizeMode: "contain",
                padding: 10,
              }}
            />
            <Text style={{ fontSize: 20, color: "red" }}>number</Text>

            <Text>number</Text>
          </Card>
        </View>
      </View>
      <View style={{ width: "100%", height: 150, padding: 5 }}>
        <Image
          source={require("../../../assets/group_2239.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "stretch",
            padding: 10,
          }}
        />
      </View>
      <Text>Layanan Fight Covid-19</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 10,
        }}
      >
        <Card style={styles.tab}>
          <Image
            source={require("../../../assets/mask_group_ek3.png")}
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              padding: 10,
            }}
          />
          <Text style={{ fontSize: 20, color: "red" }}>number</Text>

          <Text>number</Text>
        </Card>
        <Card style={styles.tab}>
          <Image
            source={require("../../../assets/mask_group_ek5.png")}
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              padding: 10,
            }}
          />
          <Text style={{ fontSize: 20, color: "red" }}>number</Text>

          <Text>number</Text>
        </Card>
        <Card style={styles.tab}>
          <Image
            source={require("../../../assets/mask_group_ek8.png")}
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              padding: 10,
            }}
          />
          <Text style={{ fontSize: 20, color: "red" }}>number</Text>

          <Text>number</Text>
        </Card>
        <Card style={styles.tab}>
          <Image
            source={require("../../../assets/mask_group_ek9.png")}
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              padding: 10,
            }}
          />
          <Text style={{ fontSize: 20, color: "red" }}>number</Text>

          <Text>number</Text>
        </Card>
        <Card style={styles.tab}>
          <Image
            source={require("../../../assets/mask_group_ek10.png")}
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              padding: 10,
            }}
          />
          <Text style={{ fontSize: 20, color: "red" }}>number</Text>

          <Text>number</Text>
        </Card>
        <Card style={styles.tab}>
          <Image
            source={require("../../../assets/mask_group_ek2.png")}
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              padding: 10,
            }}
          />
          <Text style={{ fontSize: 20, color: "red" }}>number</Text>

          <Text>number</Text>
        </Card>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  tab: {
    width: "32%",
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 15,
  },
});
