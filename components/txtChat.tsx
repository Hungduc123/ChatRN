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
// import userCurrent from "../network/userCurrent";
import { receiverMsg, senderMsg } from "../network/message";
import ChatBox from "./chatBox";
import { Avatar } from "react-native-elements";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeKeyAES } from "../data/keyAES";
import dataUser from "../data/dataUser";

type ChatScreenProp = StackNavigationProp<RootStackParamList, "Chat">;

////////////////////////////////////////////////////
///                     genKeyAES             /////////////

// const key = CryptoJS.enc.Utf8.parse(
//   Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
// );

// const iv = CryptoJS.enc.Utf8.parse(
//   Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
// );

// console.log("key " + JSON.stringify(key)); //string
// console.log(JSON.parse(JSON.stringify(key))); //object

// console.log("iv"); //?
// console.log(iv); //?

/////////////////////////////////////////////////////////
const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");
console.log("====================================");
console.log(key);
console.log("====================================");
const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
console.log("====================================");
console.log(iv);
console.log("====================================");
let keyAES = { key, iv };
export default function Chat() {
  const navigation = useNavigation<ChatScreenProp>();
  const currentUser = firebaseApp.auth().currentUser;
  const dispatch = useDispatch();
  const itemChoose = useSelector((state: any) => state.chooseItem);

  const [choose, setChoose] = useState<boolean>(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -300;
  const [messagesText, setMessagesText] = useState<string>("");
  // const [pkReceiver, setPkReceiver] = useState<any>();
  var d = new Date();
  var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const [time, setTime] = useState<string>(t);
  const Pk = useSelector((state: any) => state.PrivateKey);
  const keyASESender = useSelector((state: any) => state.KeyAES);
  const [messages, setMessages] = useState<Array<typeMessage>>([]);
  const pkReceiver = useSelector((state: any) => state.PrivateKey);
  /////////////////////////////////////////////////////////////
  var RSAKey = require("react-native-rsa");
  var rsa = new RSAKey();
  /////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   const _retrieveData = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem(currentUser.uid);
  //       if (value !== null) {
  //         keyAES = JSON.parse(value);
  //         console.log("value storage");
  //         console.log(value);
  //       } else {
  //         const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");
  //         console.log("====================================");
  //         console.log(key);
  //         console.log("====================================");
  //         const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
  //         console.log("====================================");
  //         console.log(iv);
  //         console.log("====================================");
  //         keyAES = { key, iv };
  //         try {
  //           await AsyncStorage.setItem(currentUser.uid, JSON.stringify(keyAES));
  //         } catch (error) {
  //           // Error saving data
  //         }
  //       }
  //     } catch (error) {
  //       // Error retrieving data
  //     }
  //   };
  //   _retrieveData();
  // }, []);

  // _retrieveData();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemChoose.name,
    });
  }, [navigation]);

  useEffect(() => {
    const doIt = async () => {
      ////////////////////////////////////////////////////////////////

      const getUkRSA = async () => {
        let tempUkReceiver: any = {};
        try {
          await firebaseApp
            .database()
            .ref("publicKey/" + itemChoose.uid)
            .on("value", (dataSnapshot: any) => {
              console.log("dataSnapshot.val");
              console.log(dataSnapshot.val());
              tempUkReceiver = { ...dataSnapshot.val() };
              console.log("ukReceiver");
              console.log(tempUkReceiver);
            });
        } catch (error) {
          console.log(error);
        }
        return tempUkReceiver;
      };

      const enCodeRSAWithKeyAES = async (tempUkReceiver: any) => {
        rsa.setPublicString(JSON.stringify({ ...tempUkReceiver }));
        var encryptedKey = rsa.encrypt(JSON.stringify(key));
        var encryptedIv = rsa.encrypt(JSON.stringify(iv));

        console.log("====================================");
        console.log("encryptedKey   " + encryptedKey);
        console.log("====================================");
        console.log("====================================");
        console.log("encryptedIv    " + encryptedIv);
        console.log("====================================");

        return { encryptedKey, encryptedIv };
      };
      const sendRSAWithKeyAES = async (encrypted: any, receiver: any) => {
        try {
          ///////////////////////////////////chua sen dc rsa ,
          await firebaseApp
            .database()
            .ref("RSA/" + currentUser.uid)
            .child(receiver.uid)
            .set({
              messageRSA: {
                sender: currentUser.uid,
                receiver: receiver.uid,
                encryptedKey: encrypted.encryptedKey,
                encryptedIv: encrypted.encryptedIv,
              },
            });
          await firebaseApp
            .database()
            .ref("RSA/" + receiver.uid)
            .child(currentUser.uid)
            .set({
              messageRSA: {
                sender: currentUser.uid,
                receiver: receiver.uid,
                encryptedKey: encrypted.encryptedKey,
                encryptedIv: encrypted.encryptedIv,
              },
            });
        } catch (error) {
          console.error(error);
        }
      };

      ///////////

      ///////////////////////////////////////////////////////////////////////
      let RSAToReceive: string | null = null;
      try {
        RSAToReceive = await AsyncStorage.getItem(
          `RSA ${currentUser.uid} to ${itemChoose.uid}`
        );

        console.log(
          `RSA ${currentUser.uid} to ${itemChoose.uid} ` +
            RSAToReceive +
            "-----------------------------------"
        );
      } catch (e) {
        console.log(e);
      }

      if (!RSAToReceive) {
        //send
        await getUkRSA().then((tempUkReceiver) => {
          enCodeRSAWithKeyAES(tempUkReceiver).then(async (encrypted) => {
            try {
              await AsyncStorage.setItem(
                `RSA ${currentUser.uid} to ${itemChoose.uid}`,
                encrypted.toString()
              );
            } catch (error) {
              // Error saving data
            }
            sendRSAWithKeyAES(encrypted, itemChoose);
            // .then(() => {
            // getKeyAESFromRSA().then((tempKeyAESEncodeByRSA) => {
            //   if (currentUser.uid === tempKeyAESEncodeByRSA.sender) {
            //     decodeRSA(tempKeyAESEncodeByRSA); //////////////////////////////////////////////////////////////
            //   }
            // });
            // });
          });
        });
      }

      //get local
      //ma hoa
    };

    doIt();
  }, []);
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
            let decrypt = CryptoJS.AES.decrypt(
              child.val().messene.msg,
              keyAES.key,
              {
                iv: keyAES.iv,
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
    } catch (error) {
      alert(error);
    }
    ////////////////////////////////////////////
    console.log("====================================");
    console.log("useEffect chat");
    console.log("====================================");
  }, []);

  const handleSend = async () => {
    if (messagesText) {
      var d = new Date();
      var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      setTime(t);
      console.log("====================================");
      console.log("key");
      console.log(keyAES);

      console.log("====================================");
      let sendData = CryptoJS.enc.Utf8.parse(messagesText);
      let encrypted = CryptoJS.AES.encrypt(sendData, keyAES.key, {
        iv: keyAES.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());
      senderMsg(encrypted.toString(), currentUser.uid, itemChoose.uid, "", time)
        .then(() => {
          setMessagesText("");
        })
        .catch((err) => alert(err));
      receiverMsg(
        encrypted.toString(),
        currentUser.uid,
        itemChoose.uid,
        "",
        time
      )
        .then(() => {})
        .catch((err: any) => alert(err));
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
