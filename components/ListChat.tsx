import { Card } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../colors/colors";
import styles from "../styles/styles";
import firebaseApp from "../firebase/config.js";
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { log } from "react-native-reanimated";
import dataUser from "../data/dataUser";
import ShowUsers from "./showUser";
import { Avatar } from "react-native-elements";

import * as ImagePicker from "expo-image-picker";
import { chooseItem } from "../slice/chooseItem";
import { useDispatch, useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { TypePk, TypeUk } from "../data/key";
import CryptoJS from "crypto-js";
import { KeyAES } from "../slice/KeyAES";
import { PublicKey } from "../slice/PublicKey";
import { PrivateKey } from "../slice/PrivateKey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import _ from "lodash";
import moment from "moment";
import { Searchbar } from "react-native-paper";
type ListChatScreenProp = StackNavigationProp<RootStackParamList, "ListChat">;
// const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");
// console.log("====================================");
// console.log(key);
// console.log("====================================");
// const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
// console.log("====================================");
// console.log(iv);
// console.log("====================================");
// let tempKeyAES = { key, iv };
export default function ListChat() {
  var RSAKey = require("react-native-rsa");
  var rsa = new RSAKey();
  const dispatch = useDispatch();
  // let dataUserCurrent: FirebaseAuthTypes.User;
  const navigation = useNavigation<ListChatScreenProp>();
  const userCurrent = firebaseApp.auth().currentUser;

  const [userDetail, setUserDetail] = useState<dataUser>({
    email: "",
    name: "",
    profileImg: "",
    uid: "",
    time: "",
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [dataUserCurrent, setDataUserCurrent] = useState<dataUser>();
  const [searchQuery, setSearchQuery] = useState<any>("");
  useEffect(() => {
    let onValueChange: any;
    try {
      onValueChange = firebaseApp
        .database()
        .ref("/users")
        .on("value", (snapshot: any) => {
          let users: any[] = [];
          snapshot.forEach((child: any) => {
            if (userCurrent.uid !== child.val().uid) {
              users.push({
                ...child.val(),
              });
            }
          });
          console.log("====================================");
          console.log({ users });
          console.log("====================================");
          if (searchQuery !== "") {
            const temp = _.sortBy(users, "time")
              .reverse()
              .filter((item: any) => item.name.includes(searchQuery));
            console.log({ temp });

            setAllUsers(temp);
          } else {
            // setAllUsers(_.sortBy(users, "time").reverse());
            setAllUsers(_.sortBy(users, "time").reverse());
          }
        });
    } catch (error) {
      console.log(error);
    }
    return () =>
      firebaseApp.database().ref("/users").off("value", onValueChange);
  }, [searchQuery]);

  const onChangeSearch = (query: any) => setSearchQuery(query);
  const RenderItem = (props: any) => {
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={async () => {
          // await getUkRSA(props.it).then((tempUkReceiver) => {
          //   enCodeRSA(tempUkReceiver).then((encrypted) => {
          //     sendRSA(encrypted, props.it);
          //   });
          // });

          const action = chooseItem(props.it);
          dispatch(action);
          navigation.navigate("KhaiBaoOrChat");
        }}
      >
        <Card style={{ width: "90%", borderRadius: 10, padding: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              rounded
              source={{
                uri: props.it.profileImg,
              }}
            />
            <View>
              {props.it.newMsg ? (
                <Text style={{ fontWeight: "bold" }}>
                  Bạn có tin nhắn mới chưa đọc
                </Text>
              ) : (
                <></>
              )}
            </View>
          </View>

          <Text>{props.it.name}</Text>

          {moment(props.it.time, "MMMM Do YYYY, h:mm:ss a")
            .startOf("minute")
            .fromNow()
            .includes("seconds") ||
          moment(props.it.time, "MMMM Do YYYY, h:mm:ss a")
            .startOf("minute")
            .fromNow()
            .includes("a minute ago") ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text style={{ color: "green" }}>Active Now</Text>
              <Fontisto name="radio-btn-active" size={24} color="green" />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFCC00" }}>
                {moment(props.it.time, "MMMM Do YYYY, h:mm:ss a")
                  .startOf("minute")
                  .fromNow()}
              </Text>
              <Fontisto name="radio-btn-active" size={24} color="#FFCC00" />
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={allUsers}
        keyExtractor={(item) => item.uid!.toString()}
        renderItem={({ item }) => <RenderItem it={item}></RenderItem>}
      ></FlatList>
    </SafeAreaView>
  );
}
