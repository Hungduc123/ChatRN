import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { RootStackParamList } from "../RootStackParamList";
import firebaseApp from "../../firebase/config.js";
import { useSelector } from "react-redux";
import { Card } from "native-base";
import QRCode from "react-native-qrcode-svg";
import styles from "../../styles/styles";
import { log } from "react-native-reanimated";

type HistoryYTeScreenProp = StackNavigationProp<
  RootStackParamList,
  "HistoryKhaiBaoYTe"
>;
export default function HistoryKhaiBaoYTe(id: any) {
  const navigation = useNavigation<HistoryYTeScreenProp>();
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const [data, setData] = useState<Array<any>>([]);
  const keyAES = useSelector((state: any) => state.KeyAES);
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
          let arrQrKhaiBaoYte: Array<any> = [];

          snapshot.forEach((child: any) => {
            arrQrKhaiBaoYte.push({
              "Họ tên (ghi chữ IN HOA)": child.val().ten,
              "Số hộ chiếu / CMND / CCCD": child.val().cmnd,
              "Năm sinh": child.val().namSinh,
              "Giới tính": child.val().gioiTinh,
              "Quốc tịch": child.val().quocTich,
              "Tỉnh thành": child.val().tinhThanh,
              "Quận / huyện": child.val().quanHuyen,
              "Phường / xã": child.val().phuongXa,
              "Số nhà, phố, tổ dân phố/thôn/đội ": child.val().soNha,
              time: child.val().time,
            });
          });
          //   snapshot.forEach((child: any) => {
          //     console.log({ child });

          //     arrQrKhaiBaoYte.push({ ...child.val() });
          //   });
          // setUserDetail(currentUser);
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
      <Text>Lịch sử khai báo y tế {itemChoose.uid} </Text>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <>
            <Card>
              <QRCode value={JSON.stringify(item)} />
              <Text>{item.time}</Text>
            </Card>
          </>
        )}
      ></FlatList>
    </View>
  );
}
