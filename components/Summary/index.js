import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LineChart from "../Chart";

export default function Summary({ slug, report, selectedCountryId }) {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const [mapData, setMapData] = useState({});
  // useEffect(() => {
  //   if (selectedCountryId) {
  //     const temp = selectedCountryId.toLowerCase();
  //     import(`@highcharts/map-collection/countries/vn/vn-all.geo.json`).then(
  //       (res) => {
  //         setMapData(res);
  //         console.log("res");
  //         console.log(res);
  //       }
  //     );
  //   }
  // }, [selectedCountryId]);
  return (
    <View>
      <Text>This is a Summary</Text>
      <LineChart slug={slug} data={report} />
    </View>
  );
}
