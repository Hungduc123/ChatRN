import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ImageBackground,
} from "react-native";
import { getCountries, getDataChart, getReportByCountry } from "../apis";
import styles from "../styles/styles";
import HighMaps from "./Chart/HighMaps";
import CountrySelector from "./CountrySelector";
import Highlight from "./Highlight";
import { RootStackParamList } from "./RootStackParamList";
import Summary from "./Summary";
import _ from "lodash";
import { then } from "../metro.config";
import LineChartMini from "./LineChartMini";
import { AntDesign } from "@expo/vector-icons";
import { Card } from "native-base";
import { DataInVietNam } from "../slice/DataInVietNam";
import { useDispatch } from "react-redux";
import firebaseApp from "../firebase/config.js";
import moment from "moment";
import { UpdateUser } from "../network/User";

type TrackingScreenProp = StackNavigationProp<RootStackParamList, "ListFriend">;
export default function Tracking() {
  const dispatch = useDispatch();
  const navigation = useNavigation<TrackingScreenProp>();
  const currentUser = firebaseApp.auth().currentUser;

  const [countries, setCountries] = useState<any>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<any>("");
  const [report, setReport] = useState<any>([]);
  const [chartMini, setChartMini] = useState<any>({});
  const [cakhoi, setCakhoi] = useState<any>([]);
  const [canhiem, setCanhiem] = useState<any>([]);
  const [catuvong, setCatuvong] = useState<any>([]);
  const [slug, setSlug] = useState<any>(" aaa");
  const [openChart, setOpenChart] = useState<boolean>(false);

  const handleOnChange = (e: any) => {
    console.log({ e });
    if (e !== null) {
      setSelectedCountryId(e);
    }
  };
  useEffect(() => {
    UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, []);
  useEffect(() => {
    getCountries().then((res: any) => {
      console.log({ res });
      const countries = _.sortBy(res.data, "Country");

      setCountries(countries);
      setSelectedCountryId("VN");
    });
    getDataChart().then((res) => {
      console.log("====================================");
      console.log("getDataChart");
      console.log(res);

      console.log("====================================");
      // setChartMini({
      //   cakhoi: res.data.cakhoi,
      //   canhiem: res.data.canhiem,
      //   catuvong: res.data.catuvong,
      // });
      setCakhoi(res.data.cakhoi);
      setCanhiem(res.data.canhiem);

      setCatuvong(res.data.catuvong);
    });
  }, []);
  useEffect(() => {
    if (selectedCountryId !== "" && countries !== []) {
      const { Slug } = countries.find(
        (country: any) => country.ISO2 === selectedCountryId
      );
      console.log("{ Slug }");
      console.log(Slug);
      setSlug(Slug);
      //call api
      getReportByCountry(Slug).then((res) => {
        //xoa item cuoi
        console.log({ res });
        res.data.pop();
        setReport(res.data);
      });
    }
  }, [countries, selectedCountryId]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {/* 
   
        <Highlight report={report}></Highlight>
        <View style={{ flexDirection: "row" }}>
          <LineChartMini
            colorLineChart={"green"}
            data={cakhoi}
            titleTable="Ca Khỏi"
          ></LineChartMini>
          <LineChartMini
            colorLineChart={"red"}
            data={canhiem}
            titleTable="Ca nhiễm"
          ></LineChartMini>
          <LineChartMini
            colorLineChart={"gray"}
            data={catuvong}
            titleTable="Ca tử vong"
          ></LineChartMini>
        </View>
        <HighMaps></HighMaps> */}
        <ImageBackground
          source={require("../assets/background_header.png")}
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
              source={require("../assets/vector_ek1.png")}
              style={{ width: 20, height: 20 }}
            />
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ImageBackground
              source={require("../assets/background_bottom_navbar.png")}
              style={{
                width: "90%",
                height: "50%",
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <Image
                  source={require("../assets/vector_ek26.png")}
                  style={{ width: 15, height: 15 }}
                />
                <CountrySelector
                  value={selectedCountryId}
                  countries={countries}
                  handleOnChange={handleOnChange}
                ></CountrySelector>
              </View>
            </ImageBackground>
          </View>
        </ImageBackground>
        <Highlight report={report}></Highlight>
        <Summary
          slug={slug}
          report={report}
          selectedCountryId={selectedCountryId}
        ></Summary>
        <View style={{ width: "100%", height: 150, padding: 5 }}>
          <Image
            source={require("../assets/group_2239.png")}
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
              source={require("../assets/mask_group_ek3.png")}
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
              source={require("../assets/mask_group_ek5.png")}
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
            <TouchableOpacity
              onPress={() => {
                const action = DataInVietNam({ cakhoi, canhiem, catuvong });
                dispatch(action);
                navigation.navigate("DataInVietNam");
              }}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Image
                source={require("../assets/mask_group_ek8.png")}
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: "contain",
                  padding: 10,
                }}
              />
              <Text style={{ fontSize: 10, color: "black" }}>
                Số liệu chi tiết tại Việt Nam
              </Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.tab}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("KhaiBaoYTe");
              }}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Image
                source={require("../assets/mask_group_ek9.png")}
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: "contain",
                  padding: 10,
                }}
              />

              <Text style={{ fontSize: 10, color: "black" }}>
                Khai Báo y tế
              </Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.tab}>
            <Image
              source={require("../assets/mask_group_ek10.png")}
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
              source={require("../assets/mask_group_ek2.png")}
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
    </SafeAreaView>
  );
}
