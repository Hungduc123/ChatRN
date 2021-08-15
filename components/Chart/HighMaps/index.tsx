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
  //     name: "Quảng Ninh",
  //   },
  //   VNM444: {
  //     name: "Tây Ninh",
  //   },
  //   VNM450: {
  //     name: "Điện Biên",
  //   },
  //   VNM451: {
  //     name: "Đông Bắc",
  //   },
  //   VNM452: {
  //     name: "Thái Nguyên",
  //   },
  //   VNM453: {
  //     name: "Lai Châu",
  //   },
  //   VNM454: {
  //     name: "Lạng Sơn",
  //   },
  //   VNM455: {
  //     name: "Sơn La",
  //   },
  //   VNM456: {
  //     name: "Thanh Hóa",
  //   },
  //   VNM457: {
  //     name: "Tuyên Quang",
  //   },
  //   VNM458: {
  //     name: "Yên Bái",
  //   },
  //   VNM459: {
  //     name: "Hòa Bình",
  //   },
  //   VNM460: {
  //     name: "Hải Dương",
  //   },
  //   VNM4600: {
  //     name: "Hải Phòng",
  //   },
  //   VNM461: {
  //     name: "Hưng Yên",
  //   },
  //   VNM462: {
  //     name: "Hà Nội",
  //   },
  //   VNM463: {
  //     name: "Bắc Ninh",
  //   },
  //   VNM464: {
  //     name: "Vĩnh Phúc",
  //   },
  //   VNM466: {
  //     name: "Ninh Bình",
  //   },
  //   VNM467: {
  //     name: "Hà Nam",
  //   },
  //   VNM468: {
  //     name: "Nam Định",
  //   },
  //   VNM469: {
  //     name: "Phú Thọ",
  //   },
  //   VNM470: {
  //     name: "Bắc Giang",
  //   },
  //   VNM471: {
  //     name: "Thái Bình",
  //   },
  //   VNM474: {
  //     name: "Hà Tĩnh",
  //   },
  //   VNM475: {
  //     name: "Nghệ An",
  //   },
  //   VNM476: {
  //     name: "Quảng Bình",
  //   },
  //   VNM477: {
  //     name: "Dak Lak",
  //   },
  //   VNM478: {
  //     name: "Gia Lai",
  //   },
  //   VNM479: {
  //     name: "Khánh Hòa",
  //   },
  //   VNM480: {
  //     name: "Lâm Đồng",
  //   },
  //   VNM481: {
  //     name: "Ninh Thuận",
  //   },
  //   VNM482: {
  //     name: "Phú Yên",
  //   },
  //   VNM483: {
  //     name: "Bình Dương",
  //   },
  //   VNM4834: {
  //     name: "Tiền Giang",
  //   },
  //   VNM4835: {
  //     name: "Đắk Nông",
  //   },
  //   VNM484: {
  //     name: "Bình Phước",
  //   },
  //   VNM485: {
  //     name: "Bình Định",
  //   },
  //   VNM486: {
  //     name: "Kon Tum",
  //   },
  //   VNM487: {
  //     name: "Quàng Nam",
  //   },
  //   VNM488: {
  //     name: "Quảng Ngãi",
  //   },
  //   VNM489: {
  //     name: "Quảng Trị",
  //   },
  //   VNM490: {
  //     name: "Thừa Thiên Huế",
  //   },
  //   VNM491: {
  //     name: "Đà Nẵng",
  //   },
  //   VNM495: {
  //     name: "Bà Rịa Vũng Tàu",
  //   },
  //   VNM496: {
  //     name: "Bình Thuận",
  //   },
  //   VNM497: {
  //     name: "Đông Nam Bộ",
  //   },
  //   VNM498: {
  //     name: "An Giang",
  //   },
  //   VNM499: {
  //     name: "Can Tho",
  //   },
  //   VNM500: {
  //     name: "Đồng Tháp",
  //   },
  //   VNM501: {
  //     name: "Hồ Chí Minh",
  //     inactive: "no",
  //   },
  //   VNM502: {
  //     name: "Kiên Giang",
  //   },
  //   VNM503: {
  //     name: "Long An",
  //   },
  //   VNM504: {
  //     name: "Bến Tre",
  //   },
  //   VNM505: {
  //     name: "Hậu Giang",
  //   },
  //   VNM506: {
  //     name: "Bạc Liêu",
  //   },
  //   VNM507: {
  //     name: "Cà Mau",
  //   },
  //   VNM508: {
  //     name: "Sóc Trăng",
  //   },
  //   VNM509: {
  //     name: "Trà Vinh",
  //   },
  //   VNM510: {
  //     name: "Vĩnh Long",
  //   },
  //   VNM511: {
  //     name: "Cao Bằng",
  //   },
  //   VNM512: {
  //     name: "Hà Giang",
  //   },
  //   VNM5483: {
  //     name: "Lào Cai",
  //   },
  // };
  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }
  // function removeAccents(str) {
  //   var AccentsMap = [
  //     "aàảãáạăằẳẵắặâầẩẫấậ",
  //     "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
  //     "dđ",
  //     "DĐ",
  //     "eèẻẽéẹêềểễếệ",
  //     "EÈẺẼÉẸÊỀỂỄẾỆ",
  //     "iìỉĩíị",
  //     "IÌỈĨÍỊ",
  //     "oòỏõóọôồổỗốộơờởỡớợ",
  //     "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
  //     "uùủũúụưừửữứự",
  //     "UÙỦŨÚỤƯỪỬỮỨỰ",
  //     "yỳỷỹýỵ",
  //     "YỲỶỸÝỴ",
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
      <Text>Số Liệu Của Việt Nam</Text>
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
            <Text>Tỉnh/ Thành phố</Text>
          </Card>

          <Card style={styles.titleTable}>
            <Text>Số ca nhiễm</Text>
          </Card>

          <Card style={styles.titleTable}>
            <Text>Số ca khỏi</Text>
          </Card>

          <Card style={styles.titleTable}>
            <Text>Số ca tử vong</Text>
          </Card> */}
          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            Tỉnh/ Thành phố
          </Text>

          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            Số ca nhiễm
          </Text>

          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            Số ca khỏi
          </Text>

          <Text style={[styles.textTable, { fontSize: 17, color: "black" }]}>
            Số ca tử vong
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
