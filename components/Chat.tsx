import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Card, Textarea } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NativeModules,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import colors from "../colors/colors";
import styles from "../styles/styles";
import { RootStackParamList } from "./RootStackParamList";

import firebaseApp from "../firebase/config.js";
import typeMessage from "../data/typeMessage";
// import userCurrent from "../network/userCurrent";
import { receiverMsg, senderMsg } from "../network/message";
import { Avatar } from "react-native-elements";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeUk } from "../data/key";
import moment from "moment";
import { UpdateMsg, UpdateUser } from "../network/User";

type ChatScreenProp = StackNavigationProp<RootStackParamList, "Chat">;

export default function Chat() {
  const navigation = useNavigation<ChatScreenProp>();
  const currentUser = firebaseApp.auth().currentUser;
  const dispatch = useDispatch();
  const keyAES = useSelector((state: any) => state.KeyAES);
  console.log("====================================");
  console.log({ keyAES });
  console.log("====================================");
  const [choose, setChoose] = useState<boolean>(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -300;
  const [messagesText, setMessagesText] = useState<string>("");

  const [messages, setMessages] = useState<Array<typeMessage>>([]);
  const itemChoose = useSelector((state: any) => state.chooseItem);

  // //////////
  // const [keyAesStore, setKeyAesStore] = useState<any>(null);
  // const [keyAesEncrypted, setKeyAesEncrypted] = useState<any>(null);
  // const [ukItemChoose, setUkItemChoose] = useState<any>(null);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);
  // const [keyAESFinal, setKeyAESFinal] = useState<any>(
  //   keyAES ? JSON.parse(keyAES) : null
  // );
  // const keyAESFinal = useSelector((state: any) => state.KeyAES);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemChoose.name,
    });
  }, [navigation]);
  // useEffect(() => {
  //   UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
  // }, []);
  useEffect(() => {
    if (!itemChoose.isDoctored) {
      UpdateMsg(itemChoose.uid, false);
    }
  }, []);

  let onValueChange: any;
  useEffect(() => {
    if (keyAES !== "") {
      console.log(
        "getMsg-----------------------------------------------------------"
      );
      const key = JSON.parse(keyAES);
      //  getMsg(currentUser, itemChoose, keyAESFinal);
      console.log("====================================");
      console.log({ key });
      console.log("====================================");
      onValueChange = firebaseApp
        .database()
        .ref("messages")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .on("value", (dataSnapshot: any[]) => {
          let msgs: typeMessage[] = [];
          console.log("====================================");
          console.log({ dataSnapshot });
          console.log("====================================");
          dataSnapshot.forEach((child) => {
            let decrypt = CryptoJS.AES.decrypt(
              child.val().messene.msg,
              key.key,
              {
                iv: key.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
              }
            );
            msgs.push({
              sendBy: child.val().messene.sender,
              receivedBy: child.val().messene.receiver,
              msg: decrypt.toString(CryptoJS.enc.Utf8),
              // msg: child.val().messene.msg,
              img: child.val().messene.img,
              time: child.val().messene.time,
            });
          });
          setMessages(msgs.reverse());
        });
    }
    return () =>
      firebaseApp
        .database()
        .ref("messages")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .off("value", onValueChange);
  }, [keyAES]);
  const RenderChatBox = (props: any) => {
    let isCurrentUser = props.it.sendBy === currentUser.uid ? true : false;
    return (
      <TouchableWithoutFeedback onLongPress={() => setChoose(!choose)}>
        <Card
          style={{
            padding: 10,
            borderTopRightRadius: 20,
            // borderBottomEndRadius: 20,
            borderTopLeftRadius: props.it.sendBy === currentUser.uid ? 20 : 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius:
              props.it.sendBy === currentUser.uid ? 0 : 20,

            alignSelf: isCurrentUser ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.it.sendBy !== currentUser.uid && (
              <Avatar
                size="small"
                rounded
                source={{
                  uri: "https://e7.pngegg.com/pngimages/505/761/png-clipart-login-computer-icons-avatar-icon-monochrome-black-thumbnail.png",
                }}
              />
            )}

            <Text style={{ padding: 10, fontSize: 20 }}>{props.it.msg}</Text>
          </View>

          {choose && (
            <Text style={{ color: colors.first }}>{props.it.time}</Text>
          )}
        </Card>
      </TouchableWithoutFeedback>
    );
  };
  const handleSend = async () => {
    if (messagesText) {
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(messagesText);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        currentUser.uid,
        itemChoose.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a")
      )
        .then(() => {
          setMessagesText("");
        })
        .catch((err) => alert(err));
      receiverMsg(
        encrypted.toString(),
        currentUser.uid,
        itemChoose.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a")
      )
        .then(() => {})
        .catch((err: any) => alert(err));
      UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
      if (itemChoose.isDoctored) {
        UpdateMsg(currentUser.uid, true);
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <View style={{ height: "100%" }}>
          <FlatList
            style={{ backgroundColor: "tomato" }}
            inverted
            data={messages}
            keyExtractor={(item) => JSON.stringify(item)}
            renderItem={({ item }) => <RenderChatBox it={item} />}
          />
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
