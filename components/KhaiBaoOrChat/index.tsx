import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Card } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../RootStackParamList";
import firebaseApp from "../../firebase/config.js";
import { KeyAES } from "../../slice/KeyAES";

type KhaiBaoOrChatScreenProp = StackNavigationProp<
  RootStackParamList,
  "KhaiBaoOrChat"
>;

export default function KhaiBaoOrChat() {
  const dispatch = useDispatch();
  const navigation = useNavigation<KhaiBaoOrChatScreenProp>();
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const currentUser = firebaseApp.auth().currentUser;
  const pk = useSelector((state: any) => state.PrivateKey);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);

  let RSAKey = require("react-native-rsa");
  let rsa = new RSAKey();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemChoose.name,
    });
  }, [navigation]);
  useEffect(() => {
    try {
      firebaseApp
        .database()
        .ref("RSA")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .once("value", (dataSnapshot: any) => {
          // setDatabaseEncrypted({ ...dataSnapshot.val().messageRSA });
          console.log("====================================");
          console.log("dataSnapshot.val().messageRSA");

          console.log(JSON.stringify(dataSnapshot.val().messageRSA));
          console.log("====================================");
          setKeyAesDatabase(dataSnapshot.val().messageRSA);
        });
    } catch (error) {
      alert(error);
    }
  }, [currentUser, itemChoose]);
  useEffect(() => {
    if (keyAesDatabase !== null) {
      console.log("====================================");
      console.log({ pk });
      console.log("====================================");
      console.log("====================================");
      console.log({ keyAesDatabase });
      console.log("====================================");

      rsa.setPrivateString(JSON.stringify(pk));
      const key = rsa.decrypt(keyAesDatabase.encryptedKey);
      const iv = rsa.decrypt(keyAesDatabase.encryptedIv);

      console.log("key");
      console.log({ key });
      console.log("iv");
      console.log({ iv });
      let temp1 = JSON.parse(key);
      let temp2 = JSON.parse(iv);
      // const action = KeyAES(
      //   JSON.stringify({
      //     key,
      //     iv,
      //   })
      // );
      // dispatch(action);
      const action = KeyAES(JSON.stringify({ key: temp1, iv: temp2 }));
      console.log({ key: temp1, iv: temp2 });

      dispatch(action);
    }
  }, [keyAesDatabase]);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          width: "40%",
          height: "50%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => navigation.navigate("HistoryKhaiBaoYTe")}
      >
        <Card
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 15,
          }}
        >
          <Text>Lịch sử khai báo y tế</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: "40%",
          height: "50%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => navigation.navigate("Chat")}
      >
        <Card
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 15,
          }}
        >
          <Text>Chat</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
}
