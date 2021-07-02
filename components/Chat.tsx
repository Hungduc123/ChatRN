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

export default function Chat() {
  const navigation = useNavigation<ChatScreenProp>();
  const currentUser = firebaseApp.auth().currentUser;
  const dispatch = useDispatch();

  const [choose, setChoose] = useState<boolean>(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -300;
  const [messagesText, setMessagesText] = useState<string>("");

  var d = new Date();
  var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const [time, setTime] = useState<string>(t);
  const [messages, setMessages] = useState<Array<typeMessage>>([]);
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const pk = useSelector((state: any) => state.PrivateKey);
  //////////
  const [keyAesStore, setKeyAesStore] = useState<any>(null);
  const [keyAesEncrypted, setKeyAesEncrypted] = useState<any>(null);
  const [ukItemChoose, setUkItemChoose] = useState<any>(null);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);
  const [keyAESFinal, setKeyAESFinal] = useState<any>(null);
  let RSAKey = require("react-native-rsa");
  let rsa = new RSAKey();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemChoose.name,
    });
  }, [navigation]);

  const getMsg = async (
    currentUser: any,
    itemChoose: any,
    keyAESFinal: any
  ) => {
    try {
      await firebaseApp
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
              keyAESFinal.decryptedKey,
              {
                iv: keyAESFinal.decryptedKIv,
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
  const getKeyAesStore = async (currentUser: any, itemChoose: any) => {
    try {
      const keyAesStore = await AsyncStorage.getItem(
        `keyAesStore ${currentUser.uid} to ${itemChoose.uid}`
      );
      if (keyAesStore !== null) {
        // We have data!!
        console.log(keyAesStore);
        console.log("already key AES");
        setKeyAesStore(JSON.parse(keyAesStore));
        setKeyAESFinal({
          decryptedKey: JSON.parse(keyAesStore).key,
          decryptedKIv: JSON.parse(keyAesStore).iv,
        });
      } else {
        console.log("create key AES");
        const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");
        console.log("====================================");
        console.log(key);
        console.log("====================================");
        const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
        console.log("====================================");
        console.log(iv);
        console.log("====================================");
        try {
          await AsyncStorage.setItem(
            `keyAesStore ${currentUser.uid} to ${itemChoose.uid}`,
            JSON.stringify({ key, iv })
          );
        } catch (error) {
          // Error saving data
        }

        setKeyAESFinal({
          decryptedKey: key,
          decryptedKIv: iv,
        });
        setKeyAesStore({ key, iv });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUkRSADatabase = async (itemChoose: any) => {
    let tempUkReceiver;
    try {
      await firebaseApp
        .database()
        .ref("publicKey/" + itemChoose.uid)
        .once("value", async (dataSnapshot: any) => {
          tempUkReceiver = { ...dataSnapshot.val() };
          console.log("ukReceiver");
          console.log(tempUkReceiver);
          setUkItemChoose(tempUkReceiver);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const encodeAndSendKeyAesByRsa = async (
    currentUser: any,
    itemChoose: any,
    ukItemChoose: any,
    keyAesStore: any
  ) => {
    await rsa.setPublicString(JSON.stringify({ ...ukItemChoose }));

    let encryptedKey = await rsa.encrypt(JSON.stringify(keyAesStore.key));
    let encryptedIv = await rsa.encrypt(JSON.stringify(keyAesStore.iv));

    console.log("====================================");
    console.log("encryptedKey   " + encryptedKey);
    console.log("====================================");
    console.log("====================================");
    console.log("encryptedIv    " + encryptedIv);
    console.log("====================================");
    console.log("====================================");

    console.log({ itemChoose });
    console.log("====================================");
    console.log("====================================");
    console.log({ ukItemChoose });
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
  };
  const getKeyAesDatabase = async (currentUser: any, itemChoose: any) => {
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
          setKeyAesDatabase(dataSnapshot.val().messageRSA);
        });
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    const doIt = async () => {
      if (itemChoose.isDoctored) {
        await getKeyAesStore(currentUser, itemChoose);
        console.log(" doIt a");
      }

      if (!itemChoose.isDoctored) {
        await getKeyAesDatabase(currentUser, itemChoose);
        console.log(" doIt docter");
      }
    };
    doIt();
  }, [currentUser, itemChoose]);
  useEffect(() => {
    if (keyAesStore !== null) {
      getUkRSADatabase(itemChoose);
    }
  }, [keyAesStore, itemChoose]);
  useEffect(() => {
    if (ukItemChoose !== null && keyAesStore !== null) {
      console.log({ ukItemChoose });
      console.log({ keyAesStore });

      encodeAndSendKeyAesByRsa(
        currentUser,
        itemChoose,
        ukItemChoose,
        keyAesStore
      );
    }
  }, [ukItemChoose, keyAesStore, currentUser, itemChoose]);
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

      setKeyAESFinal({
        decryptedKey: JSON.parse(key),
        decryptedKIv: JSON.parse(iv),
      });
      // setKeyAESFinal({
      //   decryptedKey: keyAESFinal.decryptedKey,
      //   decryptedKIv: keyAESFinal.decryptedKey,
      // });
    }
  }, [keyAesDatabase, pk]);
  useEffect(() => {
    console.log(
      "getMsg-----------------------------------------------------------"
    );

    console.log({ keyAESFinal });
    let onValueChange: any;
    if (keyAESFinal !== null) {
      console.log("====================================");
      console.log(
        "getMsg-----------------------------------------------------------"
      );
      console.log("====================================");
      //  getMsg(currentUser, itemChoose, keyAESFinal);
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
              keyAESFinal.decryptedKey,
              {
                iv: keyAESFinal.decryptedKIv,
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
  }, [keyAESFinal, currentUser, itemChoose]);
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
      var d = new Date();
      var t: string = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      setTime(t);
      let sendData = CryptoJS.enc.Utf8.parse(messagesText);
      let encrypted = CryptoJS.AES.encrypt(sendData, keyAESFinal.decryptedKey, {
        iv: keyAESFinal.decryptedKIv,
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
