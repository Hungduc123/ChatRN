import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import {
  getCountries,
  getData,
  getDataChart,
  getReportByCountry,
} from "../apis";
import styles from "../styles/styles";
import HighMaps from "./Chart/HighMaps";
import CountrySelector from "./CountrySelector";
import Highlight from "./Highlight";
import { RootStackParamList } from "./RootStackParamList";
import Summary from "./Summary";
import _ from "lodash";
import { then } from "../metro.config";
import LineChartMini from "./LineChartMini";
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
  const [data, setData] = useState<any>([]);

  const handleOnChange = (e: any) => {
    console.log({ e });
    if (e !== null) {
      setSelectedCountryId(e);
    }
  };
  useEffect(() => {
    getData().then((res) => {
      console.log("====================================");
      console.log("res");
      console.log(res);

      console.log("====================================");
      const ct = res.data.data.map((item: any) => {
        return { Country: item.name, ISO2: item.code };
      });
      const countries = _.sortBy(ct, "name");

      setCountries(countries);
      setSelectedCountryId("VN");
      setData(res.data.data);
    });
  }, []);
  useEffect(() => {
    if (
      selectedCountryId !== "" &&
      countries.length !== 0 &&
      data.length !== 0
    ) {
      console.log(" data");
      console.log(data);
      const country = data.find(
        (country: any) => country.code === selectedCountryId
      );
      console.log(" selectedCountryId");
      console.log(selectedCountryId);
      console.log(" country");
      console.log(country);
      // setSlug(country.name);
      //call api
      // getReportByCountry(Slug).then((res) => {
      //   //xoa item cuoi
      //   res.data.pop();
      //   setReport(res.data);
      // });

      setReport(country.timeline.reverse());
    }
  }, [countries, selectedCountryId, data]);

  return (
    <SafeAreaView style={styles.container}>
      <CountrySelector
        value={selectedCountryId}
        countries={countries}
        handleOnChange={handleOnChange}
      ></CountrySelector>
      <Summary
        slug={slug}
        report={report}
        selectedCountryId={selectedCountryId}
      ></Summary>
      {/* <ScrollView style={{ flex: 1, width: "100%" }}>
      

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
      </ScrollView> */}
    </SafeAreaView>
  );
}
