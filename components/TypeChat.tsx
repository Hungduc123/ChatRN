import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Textarea } from "native-base";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../colors/colors";
import typeMessage from "../data/typeMessage";
import { receiverMsg, senderMsg } from "../network/message";
import styles from "../styles/styles";

import firebaseApp from "../firebase/config.js";

export default function TypeChat() {
  const currentUser = firebaseApp.auth().currentUser;
  const dispatch = useDispatch();
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const [messagesText, setMessagesText] = useState<string>("");
  var d = new Date();
  var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const [time, setTime] = useState<string>(t);


  
  const handleSend = async () => {
    if (messagesText) {
      var d = new Date();
      var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      setTime(t);
      console.log("====================================");
      console.log("key");
      console.log(keyAES);

      console.log("====================================");
      // let sendData = CryptoJS.enc.Utf8.parse(messagesText);
      // let encrypted = CryptoJS.AES.encrypt(sendData, keyAES.key, {
      //   iv: keyAES.iv,
      //   mode: CryptoJS.mode.CBC,
      //   padding: CryptoJS.pad.Pkcs7,
      // });
      // console.log(encrypted.toString());
      senderMsg(messagesText, currentUser.uid, itemChoose.uid, "", time)
        .then(() => {
          setMessagesText("");
        })
        .catch((err) => alert(err));
      receiverMsg(messagesText, currentUser.uid, itemChoose.uid, "", time)
        .then(() => {})
        .catch((err: any) => alert(err));
    }
  };
  return (
    <View
      style={{
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Textarea
        onChangeText={(Value) => setMessagesText(Value)}
        style={[styles.input, { width: "70%" }]}
        value={messagesText}
        placeholderTextColor={colors.first}
        placeholder="type here..."
        rowSpan={2}
      />
      <View style={{ flexDirection: "row" }}>
        <FontAwesome5
          style={{ paddingRight: 10 }}
          name="camera"
          size={30}
          color={colors.first}
        />
        <TouchableOpacity onPress={handleSend}>
          <Feather
            style={{ paddingRight: 10 }}
            name="send"
            size={40}
            color={colors.first}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
