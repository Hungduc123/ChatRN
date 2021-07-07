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
import CryptoJS from "crypto-js";

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
