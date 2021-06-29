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

import { useDispatch, useSelector } from "react-redux";
import colors from "../colors/colors";
import styles from "../styles/styles";
import { RootStackParamList } from "./RootStackParamList";
import { useEffect } from "react";
import firebaseApp from "../firebase/config.js";
import typeMessage from "../data/typeMessage";
// import userCurrent from "../network/userCurrent";
import { receiverMsg, senderMsg } from "../network/message";
import { Avatar } from "react-native-elements";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeUk } from "../data/key";

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

  const [choose, setChoose] = useState<boolean>(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -300;
  const [messagesText, setMessagesText] = useState<string>("");
  // const tempKeyAES = useSelector((state: any) => state.KeyAES);
  console.log("====================================");
  // console.log(tempKeyAES);

  // const keyAES = JSON.parse(tempKeyAES);
  // const [pkReceiver, setPkReceiver] = useState<any>();
  var d = new Date();
  var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const [time, setTime] = useState<string>(t);
  const [messages, setMessages] = useState<Array<typeMessage>>([]);
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const [databaseEncrypted, setDatabaseEncrypted] = useState<any>(null);
  const pk = useSelector((state: any) => state.PrivateKey);
  let encrypted: any = null;

  /////////////////////////////////////////////////////////////
  let RSAKey = require("react-native-rsa");
  let rsa = new RSAKey();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemChoose.name,
    });
  }, [navigation]);

  const getUkRSA = async () => {
    let tempUkReceiver: any = {};
    let encryptedKey;
    let encryptedIv;
    try {
      await firebaseApp
        .database()
        .ref("publicKey/" + itemChoose.uid)
        .once("value", async (dataSnapshot: any) => {
          console.log("dataSnapshot.val");

          console.log(dataSnapshot.val());
          tempUkReceiver = { ...dataSnapshot.val() };
          console.log("ukReceiver");
          console.log(tempUkReceiver);
          //////////////////////////
          //  encode

          await rsa.setPublicString(JSON.stringify({ ...tempUkReceiver }));

          encryptedKey = await rsa.encrypt(JSON.stringify(keyAES.key));
          encryptedIv = await rsa.encrypt(JSON.stringify(keyAES.iv));

          console.log("====================================");
          console.log("encryptedKey   " + encryptedKey);
          console.log("====================================");
          console.log("====================================");
          console.log("encryptedIv    " + encryptedIv);
          console.log("====================================");
          ////////////////////////////////////////
          ///send rsa
          await firebaseApp
            .database()
            .ref("RSA/" + currentUser.uid)
            .child(itemChoose.uid)
            .set({
              messageRSA: {
                sender: currentUser.uid,
                receiver: itemChoose.uid,
                encryptedKey: encryptedKey,
                encryptedIv: encryptedIv,
              },
            });
          await firebaseApp
            .database()
            .ref("RSA/" + itemChoose.uid)
            .child(currentUser.uid)
            .set({
              messageRSA: {
                sender: currentUser.uid,
                receiver: itemChoose.uid,
                encryptedKey: encryptedKey,
                encryptedIv: encryptedIv,
              },
            });
          //////////////////////////////
          await storeEncrypted({ encryptedKey, encryptedIv });

          return { encryptedKey, encryptedIv };
          ////////////////////////////////
        });
    } catch (error) {
      console.log(error);
    }
  };

  const storeEncrypted = async (encrypted: any) => {
    setDatabaseEncrypted({ ...encrypted });
    try {
      await AsyncStorage.setItem(
        `encrypted ${currentUser.uid} to ${itemChoose.uid}`,
        encrypted.toString()
      );
    } catch (error) {
      // Error saving data
    }
  };

  let keyAEFinal: { decryptedKey: any; decryptedKIv?: any };

  const getMsg = async (encrypted: any) => {
    console.log("====================================");

    console.log("databaseEncrypted");
    console.log(encrypted);

    if (!itemChoose.isDoctored) {
      console.log("====================================");
      console.log("pk");
      console.log(pk);

      console.log("====================================");
      rsa.setPrivateString(JSON.stringify(pk));
      const key = rsa.decrypt(encrypted.encryptedKey);
      const iv = rsa.decrypt(encrypted.encryptedIv);

      console.log("key");
      console.log(key);
      console.log("iv");
      console.log(iv);
      keyAEFinal = {
        decryptedKey: JSON.parse(key),
        decryptedKIv: JSON.parse(iv),
      };
    }
    if (itemChoose.isDoctored) {
      keyAEFinal = { decryptedKey: keyAES.key, decryptedKIv: keyAES.iv };
    }

    try {
      await firebaseApp
        .database()
        .ref("messages")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .on("value", (dataSnapshot: any[]) => {
          let msgs: typeMessage[] = [];

          dataSnapshot.forEach((child) => {
            let decrypt = CryptoJS.AES.decrypt(
              child.val().messene.msg,
              keyAEFinal.decryptedKey,
              {
                iv: keyAEFinal.decryptedKIv,
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
  };
  const getAES = async () => {
    //////////////////////////////////////////////////////////user
    if (itemChoose.isDoctored) {
      let StorageEncrypted: string | null = null;
      // try {
      //   StorageEncrypted = await AsyncStorage.getItem(
      //     `encrypted ${currentUser.uid} to ${itemChoose.uid}`
      //   );
      //   console.log("====================================");
      //   console.log("StorageEncrypted");
      //   console.log(StorageEncrypted);

      //   console.log("====================================");
      //   if (StorageEncrypted) {
      //     // We have data!!
      //     setDatabaseEncrypted(JSON.parse(StorageEncrypted));
      //   } else {
      //     await getUkRSA().then((tempUkReceiver) => {
      //       enCodeRSAWithKeyAES(tempUkReceiver).then((encrypted) => {
      //         sendRSAWithKeyAES(encrypted, itemChoose);
      //       });
      //     });
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
      encrypted = await getUkRSA();
    }

    ///////////////////////////////////////////////////////////doctor
    if (!itemChoose.isDoctored) {
      try {
        await firebaseApp
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
            encrypted = dataSnapshot.val().messageRSA;
          });
      } catch (error) {
        alert(error);
      }
    }
  };
  useEffect(() => {
    let onValueChange: void;
    const doIt = async () => {
      Promise.all([
        await getAES().then(async () => {
          console.log("====================================");
          console.log("encrypted");
          console.log(encrypted);

          console.log("====================================");
          onValueChange = await getMsg(encrypted);
        }),
      ]).catch((ex) => console.error(ex));
    };
    doIt();
    return () =>
      firebaseApp
        .database()
        .ref("messages")
        .child(currentUser.uid)
        .child(itemChoose.uid)
        .off("value", onValueChange);
  }, []);

  const handleSend = async () => {
    if (messagesText) {
      var d = new Date();
      var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      setTime(t);

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
