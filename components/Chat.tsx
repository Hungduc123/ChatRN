import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Card, Textarea } from "native-base";
import React, { useLayoutEffect, useState } from "react";
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

import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import colors from "../colors/colors";
import styles from "../styles/styles";
import { RootStackParamList } from "./RootStackParamList";
import { useEffect } from "react";
import firebaseApp from "../firebase/config.js";
import typeMessage from "../data/typeMessage";
import userCurrent from "../network/userCurrent";
import { recieverMsg, senderMsg } from "../network/message";
import ChatBox from "./chatBox";
import { Avatar } from "react-native-elements";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeKeyAES } from "../data/keyAES";
// import { KeyAES } from "../slice/KeyAES";

type ChatScreenProp = StackNavigationProp<RootStackParamList, "Chat">;

////////////////////////////////////////////////////
///                     genKeyAES             /////////////

const key = CryptoJS.enc.Utf8.parse(
  Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
);

const iv = CryptoJS.enc.Utf8.parse(
  Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
);
console.log(key); //?

/////////////////////////////////////////////////////////

export default function Chat() {
  const currentUser = firebaseApp.auth().currentUser;
  const dispatch = useDispatch();
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const navigation = useNavigation<ChatScreenProp>();

  const [choose, setChoose] = useState<boolean>(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -300;
  const [messagesText, setMessagesText] = useState<string>("");
  const [messages, setMessages] = useState<typeMessage[]>([]);
  const [pkReceiver, setPkReceiver] = useState<any>();
  var d = new Date();
  var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const [time, setTime] = useState<string>(t);

  const [messagesKeyAES, setMessagesKeyAES] = useState<any>("");
  const Pk = useSelector((state: any) => state.PrivateKey);

  /////////////////////////////////////////////////////////////
  var RSAKey = require("react-native-rsa");
  var rsa = new RSAKey();
  /////////////////////////////////////////////////////////////

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemChoose.name,
    });
  }, [navigation]);
  useEffect(() => {
    try {
      firebaseApp
        .database()
        .ref("messages")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .on("value", (dataSnapshot: any[]) => {
          let msgs: typeMessage[] = [];
          dataSnapshot.forEach((child) => {
            msgs.push({
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              img: child.val().messege.img,
              time: child.val().messege.time,
            });
          });
          setMessages(msgs.reverse());
        });
      //////////////////////////////                                         get keyAES
      firebaseApp
        .database()
        .ref("RSA")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .on("value", (dataSnapshot: any) => {
          if (currentUser.uid !== dataSnapshot.val().messageRSA.sender) {
            //  setMessagesKeyAES(dataSnapshot.val().messageRSA.msg);
            rsa.setPrivateString(JSON.stringify(Pk));
            var decrypted = rsa.decrypt(dataSnapshot.val().messageRSA.msg);
            setMessagesKeyAES(decrypted);
          }
        });
      /////////////////////////////////
      //                                                         Decrypt AES

      //////////////////////////////////
    } catch (error) {
      alert(error);
    }
    ////////////////////////////////////////////
  }, []);

  const handleSend = async () => {
    if (messagesText) {
      var d = new Date();
      var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      setTime(t);

      ///////////////////////////////////////////////////////////////
      ///////////////          Encode RSA    /////////////////////
      // try {
      //   firebaseApp
      //     .database()
      //     .ref("publicKey/" + itemChoose.uid)
      //     .on("value", (dataSnapshot: any) => {
      //       console.log(dataSnapshot);

      //       setPkReceiver(dataSnapshot.val());
      //     });
      // } catch (error) {
      //   console.log(error);
      // }
      // console.log("pkReceiver");
      // console.log(pkReceiver);

      // rsa.setPublicString(JSON.stringify(pkReceiver));

      // var encrypted = rsa.encrypt(messagesText);
      ///////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////////////
      ///////////////          Encode EAS    /////////////////////

      let sendData = CryptoJS.enc.Utf8.parse(messagesText);
      let encrypted = CryptoJS.AES.encrypt(sendData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      // return encrypted.toString(); // base64 string

      ////////////
      let decrypt = CryptoJS.AES.decrypt(encrypted.toString(), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(decrypt.toString(CryptoJS.enc.Utf8));

      ///////////////////////////////////////////////////////

      senderMsg(messagesText, currentUser.uid, itemChoose.uid, "", time)
        .then(() => {
          setMessagesText("");
        })
        .catch((err) => alert(err));
      recieverMsg(messagesText, currentUser.uid, itemChoose.uid, "", time)
        .then(() => {})
        .catch((err) => alert(err));
    }
  };

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
                  uri: itemChoose.profileImg,
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <View style={{ height: "100%" }}>
          <Text>{messagesKeyAES}</Text>
          <FlatList
            style={{ backgroundColor: "tomato" }}
            inverted
            data={messages}
            keyExtractor={(item) => item.time.toString()}
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
