import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Card, Textarea } from "native-base";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
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
  Image,
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
import { notification, UpdateMsg, UpdateUser } from "../network/User";
import { Controller, useForm } from "react-hook-form";

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
  const userState = useSelector((state: any) => state.UserStore);
  // //////////
  // const [keyAesStore, setKeyAesStore] = useState<any>(null);
  // const [keyAesEncrypted, setKeyAesEncrypted] = useState<any>(null);
  // const [ukItemChoose, setUkItemChoose] = useState<any>(null);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);
  // const [keyAESFinal, setKeyAESFinal] = useState<any>(
  //   keyAES ? JSON.parse(keyAES) : null
  // );
  // const keyAESFinal = useSelector((state: any) => state.KeyAES);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sms: "",
    },
  });
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
  useEffect(() => {
    UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, []);
  // useEffect(() => {
  //   UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
  // });

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
          let msgs: any[] = [];
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
              type: child.val().messene.type,
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
            {props.it.type === "sms" ? (
              <Text style={{ padding: 10, fontSize: 20 }}>{props.it.msg}</Text>
            ) : (
              <Image
                style={{ width: 300, height: 300 }}
                source={{ uri: `data:image/jpeg;base64,${props.it.msg}` }}
              />
            )}
          </View>

          {choose && (
            <Text style={{ color: colors.first }}>{props.it.time}</Text>
          )}
        </Card>
      </TouchableWithoutFeedback>
    );
  };
  const handleSend = (messagesText: string, type: string) => {
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
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
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
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));

      if (itemChoose.isDoctored) {
        UpdateMsg(currentUser.uid, true);
      }
      notification(itemChoose.uid, "Bạn có 1 tin nhắn mới", userState);
      UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
      reset({
        sms: "",
      });
    }
  };
  const onSubmit = (data: any) => {
    console.log({ data });

    handleSend(data.sms, "sms");
  };
  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult: any = await ImagePicker.launchImageLibraryAsync();
    console.log({ pickerResult });
    console.log(pickerResult.uri);
    // setPicture(pickerResult);
    const manipResult: any = await ImageManipulator.manipulateAsync(
      pickerResult.uri,
      [{ resize: { width: 200, height: 200 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    ///////////////
    ////
    console.log("====================================");
    console.log({ manipResult });
    console.log("====================================");
    handleSend(manipResult.base64, "picture");
    // setPicture(manipResult);
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
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { width: "70%", padding: 10 }]}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
              )}
              name="sms"
              defaultValue=""
              rules={{ required: true }}
            />
            {/* <Textarea
              onChangeText={(Value) => setMessagesText(Value)}
              style={[styles.input, { width: "70%" }]}
              value={messagesText}
              placeholderTextColor={colors.first}
              placeholder="type here..."
              rowSpan={2}
            /> */}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  openImagePickerAsync();
                }}
              >
                <FontAwesome5
                  style={{ paddingRight: 10 }}
                  name="camera"
                  size={30}
                  color={colors.first}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSubmit(onSubmit)}>
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
