import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { RootStackParamList } from "../RootStackParamList";
import firebaseApp from "../../firebase/config.js";
import { useSelector } from "react-redux";
import { Card } from "native-base";
import QRCode from "react-native-qrcode-svg";
import styles from "../../styles/styles";
import CryptoJS from "crypto-js";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import colors from "../../colors/colors";

type HistoryYTeScreenProp = StackNavigationProp<
  RootStackParamList,
  "HistoryKhaiBaoYTe"
>;
export default function HistoryKhaiBaoYTe(id: any) {
  const navigation = useNavigation<HistoryYTeScreenProp>();
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const [data, setData] = useState<Array<any>>([]);
  const [data1, setData1] = useState<any>({});

  const keyAES = useSelector((state: any) => state.KeyAES);
  const [choose, setChoose] = useState<boolean>(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Lịch sử Khai Báo y tế",
    });
  }, [navigation]);
  useEffect(() => {
    let onValueChange: any;
    try {
      onValueChange = firebaseApp
        .database()
        .ref("QRKhaiBaoYTe/" + `${itemChoose.uid}`)
        .on("value", async (snapshot: any) => {
          let key = JSON.parse(keyAES);
          let arrQrKhaiBaoYte: Array<any> = [];
          console.log("====================================");
          console.log({ key });
          console.log("====================================");
          snapshot.forEach((child: any) => {
            let decrypt = CryptoJS.AES.decrypt(child.val(), key.key, {
              iv: key.iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            });

            arrQrKhaiBaoYte.push(
              JSON.parse(decrypt.toString(CryptoJS.enc.Utf8))
            );
            console.log("====================================");
            console.log(decrypt.toString(CryptoJS.enc.Utf8));
            console.log("====================================");
          });

          console.log("====================================");
          console.log({ arrQrKhaiBaoYte });
          console.log("====================================");

          setData(arrQrKhaiBaoYte);
        });
    } catch (error) {
      console.log(error);
    }
    return () =>
      firebaseApp
        .database()
        .ref("QRKhaiBaoYTe/" + `${itemChoose.uid}`)
        .off("value", onValueChange);
  }, []);
  return (
    <View style={styles.container}>
      <Text>Lịch sử khai báo y tế của {itemChoose.name} </Text>

      {data.toString() === [].toString() && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* <Entypo name="notifications-off" size={150} color="#563CCF" /> */}
          <MaterialCommunityIcons
            name="playlist-remove"
            size={150}
            color="#563CCF"
          />
          <Text>Không có lịch sử khai báo y tế</Text>
        </View>
      )}
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setData1(item);
              setChoose(!choose);
            }}
          >
            <Card
              style={{
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <QRCode value={JSON.stringify(item)} />
              <Text>{item.time}</Text>
            </Card>
          </TouchableOpacity>
        )}
      ></FlatList>
      {choose && (
        <Modal
          animationType="slide"
          visible={data !== null}
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Card
              style={{
                flex: 1,
                justifyContent: "space-around",
                alignItems: "center",
                borderRadius: 20,
                shadowColor: colors.first,
                width: "90%",
              }}
            >
              <TouchableOpacity onPress={() => setChoose(false)}>
                <AntDesign name="back" size={24} color={colors.first} />
              </TouchableOpacity>
              <Text style={{ color: colors.first, fontSize: 30 }}>
                Kết Quả Khai Báo Y Tế{" "}
              </Text>
              <QRCode value={JSON.stringify(data)} />

              <Text>Họ tên: {data1["Họ tên (ghi chữ IN HOA)"]}</Text>
              <Text>
                Số hộ chiếu / CMND / CCCD: {data1["Số hộ chiếu / CMND / CCCD"]}
              </Text>
              <Text>Năm sinh: {data1["Năm sinh"]}</Text>
              <Text>Giới tính: {data1["Giới tính"]}</Text>
              <Text>Quốc tịch: {data1["Quốc tịch"]}</Text>
              <Text>Tỉnh thành: {data1["Tỉnh thành"]}</Text>
              <Text>Quận / huyện: {data1["Quận / huyện"]}</Text>
              <Text>Phường / xã: {data1["Phường / xã"]}</Text>
              <Text>
                Số nhà, phố, tổ dân phố/thôn/đội:{" "}
                {data1["Số nhà, phố, tổ dân phố/thôn/đội "]}
              </Text>
              <Text>
                Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc
                gia/vùng lãnh thổ nào "("Có thể đi qua nhiều nơi")":{" "}
                {data1[
                  "Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng lãnh thổ nào (Có thể đi qua nhiều nơi)"
                ]
                  ? " có"
                  : " Không"}
              </Text>
              <Text>
                Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1
                trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt
                mỏi không?:
                {data1[
                  "Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?"
                ]
                  ? " có"
                  : " Không"}
              </Text>
            </Card>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}
