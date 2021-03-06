import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
// import HighChart from "highcharts";
// import HighchartsReactNative from "@highcharts/highcharts-react-native";
// import highchartsMap from "highcharts/modules/map";
// highchartsMap(HighChart);
// const initOptions = {
//   chart: {
//     height: 500,
//   },
//   title: { text: null },
//   mapNavigation: { enabled: true },
//   colorAxis: {
//     min: 0,
//     stops: [
//       [0.2, "#FFC4AA"],
//       [0.4, "#FF8A66"],
//       [0.6, "#FF392B"],
//       [0.8, "#b71525"],
//       [1, "#7A0826"],
//     ],
//   },
//   legend: {
//     layout: "vertical",
//     align: "right",
//     verticalAlign: "bottom",
//   },
//   series: [
//     {
//       mapData: {},
//       name: "Dan so",
//       joinBy: ["hc-key", "key"],
//     },
//   ],
// };
import { WorldMap } from "react-svg-worldmap";

import { getCity, getDetail } from "../../../apis";
import { Card } from "native-base";
import TypeTinh from "../../../data/TypeTinh";
import styles from "../../../styles/styles";
import TabSoCa from "../../TabSoCa";
import moment from "moment";
import colors from "../../../colors/colors";
export default function HighMaps() {
  const [options, setOptions] = useState({});
  const [region, setRegion] = useState({});

  const [arr, setArr] = useState<any>([]);
  const [details, setDetails] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [soNhiem, setSoNhiem] = useState<any>();
  const [soDangDieuTri, setSoDangDieuTri] = useState<any>();
  const [soHoiPhuc, setSoHoiPhuc] = useState<any>();
  const [soTuVong, setSoTuVong] = useState<any>();
  const [dayUpdate, setDayUpdate] = useState<string>();

  // const [timeUpdate, setTimeUpdate] = useState<string>("");
  useEffect(() => {
    const doIt = async () => {
      await getCity().then((res) => {
        setArr(res.data.key);
      });
      await getDetail().then((res) => {
        setDayUpdate(
          moment(res.data.lastUpdatedAtApify).format("MMMM Do YYYY, h:mm:ss a")
        );
        setDetails(res.data.detail);
        setSoNhiem(res.data.infected);
        setSoDangDieuTri(res.data.treated);

        setSoHoiPhuc(res.data.recovered);

        setSoTuVong(res.data.deceased);
      });
    };
    doIt();
  }, []);
  // function exeString(text) {
  //   var textChange = "";
  //   text.split("-").forEach((t) => {
  //     textChange += capitalizeFirstLetter(t);
  //     textChange += " ";
  //   });
  //   return textChange.trim();
  // }
  // var state_specific = {
  //   VNM429: {
  //     name: "Qu???ng Ninh",
  //   },
  //   VNM444: {
  //     name: "T??y Ninh",
  //   },
  //   VNM450: {
  //     name: "??i???n Bi??n",
  //   },
  //   VNM451: {
  //     name: "????ng B???c",
  //   },
  //   VNM452: {
  //     name: "Th??i Nguy??n",
  //   },
  //   VNM453: {
  //     name: "Lai Ch??u",
  //   },
  //   VNM454: {
  //     name: "L???ng S??n",
  //   },
  //   VNM455: {
  //     name: "S??n La",
  //   },
  //   VNM456: {
  //     name: "Thanh H??a",
  //   },
  //   VNM457: {
  //     name: "Tuy??n Quang",
  //   },
  //   VNM458: {
  //     name: "Y??n B??i",
  //   },
  //   VNM459: {
  //     name: "H??a B??nh",
  //   },
  //   VNM460: {
  //     name: "H???i D????ng",
  //   },
  //   VNM4600: {
  //     name: "H???i Ph??ng",
  //   },
  //   VNM461: {
  //     name: "H??ng Y??n",
  //   },
  //   VNM462: {
  //     name: "H?? N???i",
  //   },
  //   VNM463: {
  //     name: "B???c Ninh",
  //   },
  //   VNM464: {
  //     name: "V??nh Ph??c",
  //   },
  //   VNM466: {
  //     name: "Ninh B??nh",
  //   },
  //   VNM467: {
  //     name: "H?? Nam",
  //   },
  //   VNM468: {
  //     name: "Nam ?????nh",
  //   },
  //   VNM469: {
  //     name: "Ph?? Th???",
  //   },
  //   VNM470: {
  //     name: "B???c Giang",
  //   },
  //   VNM471: {
  //     name: "Th??i B??nh",
  //   },
  //   VNM474: {
  //     name: "H?? T??nh",
  //   },
  //   VNM475: {
  //     name: "Ngh??? An",
  //   },
  //   VNM476: {
  //     name: "Qu???ng B??nh",
  //   },
  //   VNM477: {
  //     name: "Dak Lak",
  //   },
  //   VNM478: {
  //     name: "Gia Lai",
  //   },
  //   VNM479: {
  //     name: "Kh??nh H??a",
  //   },
  //   VNM480: {
  //     name: "L??m ?????ng",
  //   },
  //   VNM481: {
  //     name: "Ninh Thu???n",
  //   },
  //   VNM482: {
  //     name: "Ph?? Y??n",
  //   },
  //   VNM483: {
  //     name: "B??nh D????ng",
  //   },
  //   VNM4834: {
  //     name: "Ti???n Giang",
  //   },
  //   VNM4835: {
  //     name: "?????k N??ng",
  //   },
  //   VNM484: {
  //     name: "B??nh Ph?????c",
  //   },
  //   VNM485: {
  //     name: "B??nh ?????nh",
  //   },
  //   VNM486: {
  //     name: "Kon Tum",
  //   },
  //   VNM487: {
  //     name: "Qu??ng Nam",
  //   },
  //   VNM488: {
  //     name: "Qu???ng Ng??i",
  //   },
  //   VNM489: {
  //     name: "Qu???ng Tr???",
  //   },
  //   VNM490: {
  //     name: "Th???a Thi??n Hu???",
  //   },
  //   VNM491: {
  //     name: "???? N???ng",
  //   },
  //   VNM495: {
  //     name: "B?? R???a V??ng T??u",
  //   },
  //   VNM496: {
  //     name: "B??nh Thu???n",
  //   },
  //   VNM497: {
  //     name: "????ng Nam B???",
  //   },
  //   VNM498: {
  //     name: "An Giang",
  //   },
  //   VNM499: {
  //     name: "Can Tho",
  //   },
  //   VNM500: {
  //     name: "?????ng Th??p",
  //   },
  //   VNM501: {
  //     name: "H??? Ch?? Minh",
  //     inactive: "no",
  //   },
  //   VNM502: {
  //     name: "Ki??n Giang",
  //   },
  //   VNM503: {
  //     name: "Long An",
  //   },
  //   VNM504: {
  //     name: "B???n Tre",
  //   },
  //   VNM505: {
  //     name: "H???u Giang",
  //   },
  //   VNM506: {
  //     name: "B???c Li??u",
  //   },
  //   VNM507: {
  //     name: "C?? Mau",
  //   },
  //   VNM508: {
  //     name: "S??c Tr??ng",
  //   },
  //   VNM509: {
  //     name: "Tr?? Vinh",
  //   },
  //   VNM510: {
  //     name: "V??nh Long",
  //   },
  //   VNM511: {
  //     name: "Cao B???ng",
  //   },
  //   VNM512: {
  //     name: "H?? Giang",
  //   },
  //   VNM5483: {
  //     name: "L??o Cai",
  //   },
  // };
  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }
  // function removeAccents(str) {
  //   var AccentsMap = [
  //     "a??????????????????????????????????????????????",
  //     "A??????????????????????????????????????????????",
  //     "d??",
  //     "D??",
  //     "e??????????????????????????????",
  //     "E??????????????????????????????",
  //     "i????????????",
  //     "I????????????",
  //     "o??????????????????????????????????????????????",
  //     "O??????????????????????????????????????????????",
  //     "u?????????????????????????????",
  //     "U?????????????????????????????",
  //     "y??????????????",
  //     "Y??????????????",
  //   ];
  //   for (var i = 0; i < AccentsMap.length; i++) {
  //     var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
  //     var char = AccentsMap[i][0];
  //     str = str.replace(re, char);
  //   }
  //   return str;
  // }
  function createTable(detail: any, key: any) {
    let a: Array<any> = [];
    for (let i = 0; i < detail.length; i++) {
      // var tr = document.createElement("tr");

      var name = key.find((k: any) => k["hec-key"] == detail[i]["hc-key"]); //return oj key

      if (name) {
        let na = name.name.toUpperCase().split("-").join(" ");
        a.push({
          name: na,
          socakhoi: detail[i].socakhoi,
          socadangdieutri: detail[i].socadangdieutri,
          socatuvong: detail[i].socatuvong,
          "hc-key": detail[i]["hc-key"],
          value: detail[i].value,
        });
      }
    }
    setData(a);
  }
  useEffect(() => {
    if (arr && details) {
      createTable(details, arr);
    }
  }, [arr, details]);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>S??? Li???u C???a Vi???t Nam</Text>
      <Text>Update {dayUpdate} </Text>

      <TabSoCa
        soNhiem={soNhiem}
        soDangDieuTri={soDangDieuTri}
        soTuVong={soTuVong}
        soHoiPhuc={soHoiPhuc}
      ></TabSoCa>
      <Card style={{ width: "90%" }}>
        <View
          style={{
            flexDirection: "row",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Card style={styles.titleTable}>
            <Text>T???nh/ Th??nh ph???</Text>
          </Card>

          <Card style={styles.titleTable}>
            <Text>S??? ca nhi???m</Text>
          </Card>

          <Card style={styles.titleTable}>
            <Text>S??? ca kh???i</Text>
          </Card>

          <Card style={styles.titleTable}>
            <Text>S??? ca t??? vong</Text>
          </Card> */}
          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            T???nh/ Th??nh ph???
          </Text>

          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            S??? ca nhi???m
          </Text>

          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            S??? ca kh???i
          </Text>

          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            S??? ca t??? vong
          </Text>
        </View>

        <FlatList
          style={{ flex: 1 }}
          data={data}
          keyExtractor={(item) => item.name.toString()}
          renderItem={({ item }) => (
            <Card
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text style={styles.textTable}>{item.name}</Text>
              <Text style={[styles.textTable, { color: "red" }]}>
                {item.value}
              </Text>
              <Text style={[styles.textTable, { color: "green" }]}>
                {item.socakhoi}
              </Text>
              {/* <Text style={{width:"25%",height:30,alignItems:"center",justifyContent: "center"}}>{item.socadangdieutri}</Text> */}
              <Text style={[styles.textTable, { color: "gray" }]}>
                {item.socatuvong}
              </Text>
            </Card>
          )}
        ></FlatList>
      </Card>
    </View>
  );
}
