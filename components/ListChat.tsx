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
import { UpdateUser } from "../network/User";
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
import { FontAwesome5 } from "@expo/vector-icons";

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
  });
  const [allUsers, setAllUsers] = useState<dataUser[]>([]);

  const [dataUserCurrent, setDataUserCurrent] = useState<dataUser>();

  useEffect(() => {
    try {
      firebaseApp
        .database()
        .ref("/users")
        .on("value", (snapshot: any) => {
          let users: dataUser[] = [];
          snapshot.forEach((child: any) => {
            if (userCurrent.uid !== child.val().uid) {
              users.push({
                email: child.val().email,

                name: child.val().name,
                profileImg: child.val().profileImg,
                uid: child.val().uid,
              });
            }
          });

          setAllUsers(users);
        });
    } catch (error) {
      console.log(error);
    }

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
  }, []);
  // useEffect(() => {
  //   const doIt = async () => {
  //     const genKey = () => {
  //       var RSAKey = require("react-native-rsa");
  //       const bits = 1024;
  //       const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
  //       var rsa = new RSAKey();
  //       rsa.generate(bits, exponent);
  //       var publicKey: TypeUk = JSON.parse(rsa.getPublicString()); // return json encoded string

  //       var privateKey: TypePk = JSON.parse(rsa.getPrivateString()); // return json encoded string

  //       console.log("publicKey +---------------------------------------------");

  //       console.log(publicKey);
  //       console.log("privateKey---------------------------------------------");

  //       console.log(privateKey);

  //       const actionUk = PublicKey({
  //         ...publicKey,
  //       });
  //       const actionPk = PrivateKey({
  //         ...privateKey,
  //       });
  //       dispatch(actionPk);
  //       dispatch(actionUk);
  //       pushKey(publicKey);
  //       storeKey(publicKey, privateKey);
  //     };
  //     const storeKey = async (
  //       publicKey: TypeUk | null,
  //       privateKey: TypePk | null
  //     ) => {
  //       try {
  //         const jsonPublicKey = JSON.stringify(publicKey);
  //         const jsonPrivateKey = JSON.stringify(privateKey);

  //         await AsyncStorage.setItem("publicKey", jsonPublicKey);
  //         await AsyncStorage.setItem("privateKey", jsonPrivateKey);
  //         await AsyncStorage.setItem("uid", userCurrent.uid);
  //       } catch (e) {
  //         // saving error
  //       }
  //     };
  //     const pushKey = (publicKey: TypeUk) => {
  //       /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //       try {
  //         firebaseApp
  //           .database()
  //           .ref("publicKey/" + userCurrent.uid)
  //           .set({
  //             ...publicKey,
  //           });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       ////////////////////////////////////////////////////////////////////
  //     };
  //     let u: string | null = null;
  //     let p: string | null = null;
  //     let ui: string | null = null;
  //     try {
  //       u = await AsyncStorage.getItem("publicKey");
  //       p = await AsyncStorage.getItem("privateKey");
  //       ui = await AsyncStorage.getItem("uid");
  //       console.log("u" + u + "-----------------------------------");

  //       console.log("p" + p + "-----------------------------------");
  //       console.log("uid " + ui + "-----------------------------------");
  //     } catch (e) {
  //       console.log(e);
  //     }

  //     console.log("uid " + ui + "-----------------------------------");

  //     if (!u || !p || ui !== userCurrent.uid) {
  //       genKey();
  //     }
  //   };
  //   doIt();
  // }, []);
  async function pickImage(uid: string) {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setUserDetail({
        ...userDetail,
        profileImg: result.uri,
      });

      UpdateUser(uid, result.uri)
        .then(() => {
          // setUserDetail({
          //   ...userDetail,
          //   profileImg: result.uri,
          // });
        })
        .catch((err: any) => {
          alert(err);
        });
    }
  }
  // const changeAvatar = (uid: string) => {

  //   ImagePicker.showImagePicker(options, (response: any) => {
  //     console.log("Response = ", response);

  //       // Base 64 image:
  //       let source = "data:image/jpeg;base64," + response.data;

  //       UpdateUser(uid, source)
  //         .then(() => {
  //           setUserDetail({
  //             ...userDetail,
  //             profileImg: source,
  //           });
  //         })
  //         .catch((err: any) => {
  //           alert(err);
  //         });

  // };

  const RenderItem = (props: any) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          // await getUkRSA(props.it).then((tempUkReceiver) => {
          //   enCodeRSA(tempUkReceiver).then((encrypted) => {
          //     sendRSA(encrypted, props.it);
          //   });
          // });

          const action = chooseItem(props.it);
          dispatch(action);
          navigation.navigate("Chat");
        }}
      >
        <Avatar
          rounded
          source={{
            uri: props.it.profileImg,
          }}
        />

        <Text>{props.it.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={allUsers}
        keyExtractor={(item) => item.uid!.toString()}
        renderItem={({ item }) => <RenderItem it={item}></RenderItem>}
      ></FlatList>
    </SafeAreaView>
  );
}
