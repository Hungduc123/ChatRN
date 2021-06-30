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

type TrackingScreenProp = StackNavigationProp<RootStackParamList, "ListFriend">;
export default function Tracking() {
  const navigation = useNavigation<TrackingScreenProp>();

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
      <CountrySelector
        value={selectedCountryId}
        countries={countries}
        handleOnChange={handleOnChange}
      ></CountrySelector>

      <ScrollView style={{ flex: 1, width: "100%" }}>
        <Summary
          slug={slug}
          report={report}
          selectedCountryId={selectedCountryId}
        ></Summary>

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

        <HighMaps></HighMaps>
      </ScrollView>
    </SafeAreaView>
  );
}
