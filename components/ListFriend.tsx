import { Card } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import colors from "../colors/colors";
import styles from "../styles/styles";
import firebaseApp from "../firebase/config.js";
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { Avatar } from "react-native-paper";

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
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import { UserStore } from "../slice/UserStore";
import { UpdateUser } from "../network/User";

// const key = CryptoJS.enc.Utf8.parse(
//   Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
// );

// const iv = CryptoJS.enc.Utf8.parse(
//   Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
// );
// keyAES = {
//   key: key,
//   iv: iv,
// };
// const action = KeyAES(JSON.stringify(keyAES));
// dispatch(action);
// console.log("key " + JSON.stringify(keyAES)); //string
// console.log(JSON.parse(JSON.stringify(key))); //object

// console.log("iv"); //?
// console.log(iv); //?
type ListFriendScreenProp = StackNavigationProp<
  RootStackParamList,
  "Information"
>;
// const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");
// console.log("====================================");
// console.log(key);
// console.log("====================================");
// const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
// console.log("====================================");
// console.log(iv);
// console.log("====================================");
const a = {};
const b = {};
console.log(a === b);

export default function ListFriend() {
  var RSAKey = require("react-native-rsa");
  var rsa = new RSAKey();
  const dispatch = useDispatch();

  // let dataUserCurrent: FirebaseAuthTypes.User;
  const navigation = useNavigation<ListFriendScreenProp>();
  const userCurrent = firebaseApp.auth().currentUser;
  // const [userDetail, setUserDetail] = useState<any>({
  //   email: "",
  //   name: "",
  //   profileImg: "",
  //   uid: "",
  //   isDoctored: false,
  // });
  const [userDetail, setUserDetail] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [keyAesStore, setKeyAesStore] = useState<any>(null);
  // const [keyAESFinal, setKeyAESFinal] = useState<any>(null);
  const [ukItemChoose, setUkItemChoose] = useState<any>(null);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);
  // const [pk, setPk] = useState<any>(null);

  // const [doneKeyRsa, setDoneKeyRsa] = useState<boolean>(false);
  ////////////////////////////////////////////////////=//////////////////////////////////////////
  const genKey = async () => {
    var RSAKey = require("react-native-rsa");
    const bits = 1024;
    const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
    var rsa = new RSAKey();
    rsa.generate(bits, exponent);
    var publicKey: TypeUk = JSON.parse(rsa.getPublicString()); // return json encoded string

    var privateKey: TypePk = JSON.parse(rsa.getPrivateString()); // return json encoded string

    console.log("publicKey +---------------------------------------------");

    console.log(publicKey);
    console.log("privateKey---------------------------------------------");

    console.log(privateKey);

    const actionUk = PublicKey({
      ...publicKey,
    });
    const actionPk = PrivateKey({
      ...privateKey,
    });
    // setPk({ ...privateKey });
    dispatch(actionPk);
    dispatch(actionUk);
    await pushKey(publicKey);
    await storeKey(publicKey, privateKey);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const pushKey = async (publicKey: TypeUk) => {
    try {
      await firebaseApp
        .database()
        .ref("publicKey/" + userCurrent.uid)
        .set({
          ...publicKey,
        });
    } catch (error) {
      console.log(error);
    }
    ////////////////////////////////////////////////////////////////////
  };
  const storeKey = async (
    publicKey: TypeUk | null,
    privateKey: TypePk | null
  ) => {
    try {
      const jsonPublicKey = JSON.stringify(publicKey);
      const jsonPrivateKey = JSON.stringify(privateKey);

      await AsyncStorage.setItem(`publicKey ${userCurrent.uid}`, jsonPublicKey);
      await AsyncStorage.setItem(
        `privateKey ${userCurrent.uid}`,
        jsonPrivateKey
      );
    } catch (e) {
      // saving error
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    UpdateUser(userCurrent.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, []);
  useEffect(() => {
    try {
      firebaseApp
        .database()
        .ref("/users")
        .on("value", async (snapshot: any) => {
          let currentUser: any = {
            isDoctored: false,
            email: "",
            name: "",
            profileImg: "",
            uid: "",
          };
          snapshot.forEach((child: any) => {
            if (userCurrent.uid === child.val().uid) {
              currentUser.email = child.val().email;

              currentUser.name = child.val().name;
              currentUser.profileImg = child.val().profileImg;
              currentUser.uid = child.val().uid;
              currentUser.isDoctored = child.val().isDoctored;
            } else if (child.val().name === "Doctor") {
              setDoctor(child.val());
              let currentUser = { ...child.val() };
              const action = chooseItem(currentUser);
              dispatch(action);
            }
          });
          const action = UserStore(currentUser);
          dispatch(action);
          setUserDetail(currentUser);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const doIt = async () => {
      let u: string | null = null;
      let p: string | null = null;

      try {
        u = await AsyncStorage.getItem(`publicKey ${userCurrent.uid}`);
        p = await AsyncStorage.getItem(`privateKey ${userCurrent.uid}`);
        console.log("u   " + u + "-----------------------------------");

        console.log("p    " + p + "-----------------------------------");
        // setDoneKeyRsa(true);

        if (u !== null && p !== null) {
          console.log("yes++++++++++++++++++++++++");
          const uK = JSON.parse(u!);
          pushKey(uK);
          const pK = JSON.parse(p!);
          const actionUk = PublicKey({
            ...uK,
          });
          const actionPk = PrivateKey({
            ...pK,
          });
          dispatch(actionPk);
          dispatch(actionUk);
          console.log("u" + u + "-----------------------------------");

          console.log("p" + p + "-----------------------------------");
        } else {
          console.log("no+++++++++++++++++++++++");
          // setDoneKeyRsa(true);
          await genKey();
        }
      } catch (e) {
        console.log(e);
      }
    };
    doIt();
    console.log("Effect listerine");
  }, []);
  const getKeyAesStore = async (currentUser: any, itemChoose: any) => {
    try {
      const keyAesStore = await AsyncStorage.getItem(
        `keyAesStore ${currentUser.uid} to ${itemChoose.uid}`
      );
      if (keyAesStore !== null) {
        // We have data!!
        console.log(keyAesStore);
        console.log("already key AES");
        const action = KeyAES(keyAesStore);
        dispatch(action);
        setKeyAesStore(JSON.parse(keyAesStore));
      } else {
        console.log("create key AES");
        const key = CryptoJS.enc.Utf8.parse(currentUser.uid.slice(0, 16));
        // const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");

        console.log("====================================");
        console.log(key);
        console.log("====================================");
        // const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
        const iv = CryptoJS.enc.Utf8.parse(currentUser.uid.slice(1, 17));

        console.log("====================================");
        console.log(iv);
        console.log("====================================");
        try {
          await AsyncStorage.setItem(
            `keyAesStore ${currentUser.uid} to ${itemChoose.uid}`,
            JSON.stringify({ key, iv })
          );
        } catch (error) {
          console.log(error);
        }
        const action = KeyAES(
          JSON.stringify({
            key,
            iv,
          })
        );
        dispatch(action);

        setKeyAesStore({ key, iv });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUkRSADatabase = async (itemChoose: any) => {
    let tempUkReceiver;
    console.log("====================================");
    console.log(itemChoose.uid);
    console.log("====================================");
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

  useEffect(() => {
    if (userDetail !== null && doctor != null) {
      if (!userDetail.isDoctored) {
        getKeyAesStore(userDetail, doctor);
        console.log("====================================");
        console.log(" doIt a");
      }
    }
  }, [userDetail, doctor]);
  useEffect(() => {
    if (keyAesStore !== null) {
      getUkRSADatabase(doctor);
    }
  }, [keyAesStore, doctor]);
  useEffect(() => {
    if (
      ukItemChoose !== null &&
      keyAesStore !== null &&
      doctor !== null &&
      userDetail !== null
    ) {
      console.log({ ukItemChoose });
      console.log({ keyAesStore });

      encodeAndSendKeyAesByRsa(userDetail, doctor, ukItemChoose, keyAesStore);
    }
  }, [ukItemChoose, keyAesStore, userDetail, doctor]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          if (!userDetail.isDoctored) {
            const action = chooseItem({ ...doctor });
            dispatch(action);
            navigation.navigate("Chat");
          } else {
            navigation.navigate("ListChat");
          }
        }}
        style={{ padding: 20 }}
      >
        <FontAwesome5
          name="facebook-messenger"
          size={30}
          color={colors.first}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              // pickImage(userDetail.uid!);
            }}
          >
            {userDetail ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar.Text
                  size={80}
                  label={
                    userDetail
                      ? userDetail.name
                          .split(" ")
                          .map((word: any) => word.slice(0, 1))
                          .join("")
                      : "..."
                  }
                />
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {userDetail ? userDetail.name : "..."}
                </Text>
                <Text>{userDetail ? userDetail.email : "..."}</Text>
                <Text>
                  {userDetail
                    ? userDetail.isDoctored
                      ? "Admin"
                      : "User"
                    : "..."}
                </Text>
              </View>
            ) : (
              <>
                <Avatar.Text size={80} label={"..."} />
                <Text>{userDetail ? userDetail.name : "..."}</Text>
                <Text>{userDetail ? userDetail.email : "..."}</Text>
                <Text>
                  {userDetail
                    ? userDetail.isDoctored
                      ? "Admin"
                      : "User"
                    : "..."}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Card>
        {userDetail && !userDetail.isDoctored && (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ width: "40%" }}
              onPress={() => {
                navigation.navigate("KhaiBaoYTe");
              }}
            >
              <Card
                style={{
                  width: "100%",
                  height: "70%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                }}
              >
                <Text>Khai Báo y tế</Text>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "40%" }}
              onPress={() => {
                const action = chooseItem({ ...userDetail });
                dispatch(action);
                navigation.navigate("HistoryKhaiBaoYTe");
              }}
            >
              <Card
                style={{
                  width: "100%",
                  height: "70%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                }}
              >
                <Text>Lịch sử khai báo y tế</Text>
              </Card>
            </TouchableOpacity>
            {/* <Image
              source={require("../assets/lifesavers_new_patient.png")}
              style={{ width: "70%", height: "50%" }}
            ></Image> */}
          </View>
        )}
        {userDetail && userDetail.isDoctored && (
          <Image
            source={require("../assets/lifesavers_hand.png")}
            style={{ width: "80%", height: "80%" }}
          ></Image>
        )}
      </View>
    </SafeAreaView>
  );
}
