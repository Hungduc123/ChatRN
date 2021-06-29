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

import dataUser from "../data/dataUser";

import { Avatar } from "react-native-elements";

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
  "ListFriend"
>;
// const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");
// console.log("====================================");
// console.log(key);
// console.log("====================================");
// const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789");
// console.log("====================================");
// console.log(iv);
// console.log("====================================");

export default function ListFriend() {
  var RSAKey = require("react-native-rsa");
  var rsa = new RSAKey();
  const dispatch = useDispatch();
  let tempKeyAES = {};
  // let dataUserCurrent: FirebaseAuthTypes.User;
  const navigation = useNavigation<ListFriendScreenProp>();
  const userCurrent = firebaseApp.auth().currentUser;
  // const actionKeyAES = KeyAES(JSON.stringify(tempKeyAES));
  // dispatch(actionKeyAES);

  const [userDetail, setUserDetail] = useState<dataUser>({});

  //////////////////////////////////////////////////////////////////////////////////////////////
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
    try {
      firebaseApp
        .database()
        .ref("/users")
        .on("value", async (snapshot: any) => {
          let currentUser: dataUser = {
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
              const action = chooseItem({
                isDoctored: true,
                name: child.val().name,
                uid: child.val().uid,
              });
              dispatch(action);
            }
          });
          setUserDetail(currentUser);
          if (!currentUser.isDoctored) {
            try {
              const value = await AsyncStorage.getItem(
                `keyAES ${userCurrent.uid}}`
              );
              if (value !== null) {
                const actionKeyAES = KeyAES(value);
                dispatch(actionKeyAES);
                console.log("already");
              } else {
                console.log("new");

                // const key = CryptoJS.enc.Utf8.parse(
                //   Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
                // );

                // const iv = CryptoJS.enc.Utf8.parse(
                //   Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
                // );
                const key = CryptoJS.enc.Utf8.parse(
                  Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
                );
                console.log("====================================");
                console.log(key);
                console.log("====================================");
                const iv = CryptoJS.enc.Utf8.parse(
                  Math.floor(Math.random() * 0xffffffffffffffff).toString(16)
                );
                console.log("====================================");
                console.log(iv);
                console.log("====================================");
                const actionKeyAES = KeyAES(JSON.stringify({ key, iv }));
                dispatch(actionKeyAES);
                ///////////////
                try {
                  await AsyncStorage.setItem(
                    `keyAES ${userCurrent.uid}}`,
                    JSON.stringify({ key, iv })
                  );
                } catch (error) {
                  console.log(error);

                  // Error saving data
                }
              }
            } catch (error) {
              // Error retrieving data
            }
          }
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

          await genKey();
        }
      } catch (e) {
        console.log(e);
      }
    };
    doIt();
    console.log("Effect listerine");
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  // async function pickImage(uid: string) {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setUserDetail({
  //       ...userDetail,
  //       profileImg: result.uri,
  //     });

  //     UpdateUser(uid, result.uri)
  //       .then(() => {
  //         // setUserDetail({
  //         //   ...userDetail,
  //         //   profileImg: result.uri,
  //         // });
  //       })
  //       .catch((err: any) => {
  //         alert(err);
  //       });
  //   }
  // }
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

  // const RenderItem = (props: any) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={async () => {
  //         // await getUkRSA(props.it).then((tempUkReceiver) => {
  //         //   enCodeRSA(tempUkReceiver).then((encrypted) => {
  //         //     sendRSA(encrypted, props.it);
  //         //   });
  //         // });

  //         const action = chooseItem(props.it);
  //         dispatch(action);
  //         navigation.navigate("Chat");
  //       }}
  //     >
  //       <Avatar
  //         rounded
  //         source={{
  //           uri: props.it.profileImg,
  //         }}
  //       />

  //       <Text>{props.it.name}</Text>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <TouchableOpacity
          onPress={() => {
            if (!userDetail.isDoctored) {
              navigation.navigate("Chat");
            } else {
              navigation.navigate("ListChat");
            }
          }}
        >
          <FontAwesome5
            name="facebook-messenger"
            size={30}
            color={colors.first}
          />
        </TouchableOpacity>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              // pickImage(userDetail.uid!);
            }}
          >
            <Avatar
              size="large"
              rounded
              source={{
                uri: userDetail.profileImg,
              }}
            />
          </TouchableOpacity>

          <Text>{userDetail.name}</Text>
        </Card>
        {/* <FlatList
        style={{ flex: 1 }}
        data={allUsers}
        keyExtractor={(item) => item.uid!.toString()}
        renderItem={({ item }) => <RenderItem it={item}></RenderItem>}
      ></FlatList> */}
      </ScrollView>
    </SafeAreaView>
  );
}
