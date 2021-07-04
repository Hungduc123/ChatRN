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

  // let dataUserCurrent: FirebaseAuthTypes.User;
  const navigation = useNavigation<ListFriendScreenProp>();
  const userCurrent = firebaseApp.auth().currentUser;
  const [userDetail, setUserDetail] = useState<any>({});
  const [doctor, setDoctor] = useState<any>({});
  const [keyAesStore, setKeyAesStore] = useState<any>(null);
  // const [keyAESFinal, setKeyAESFinal] = useState<any>(null);
  const [ukItemChoose, setUkItemChoose] = useState<any>(null);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);
  const [pk, setPk] = useState<any>(null);

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
    setPk({ ...privateKey });
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
              setDoctor(child.val());
            }
          });
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
          console.log(error);
        }
        const action = KeyAES(
          JSON.stringify({
            decryptedKey: key,
            decryptedKIv: iv,
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
    if (userDetail && doctor) {
      console.log("====================================");
      console.log("aaaaaaaaaaaaa");
      console.log("====================================");
      if (userDetail.isDoctored === false) {
        getKeyAesStore(userDetail, doctor);
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
    if (ukItemChoose !== null && keyAesStore !== null) {
      console.log({ ukItemChoose });
      console.log({ keyAesStore });

      encodeAndSendKeyAesByRsa(userDetail, doctor, ukItemChoose, keyAesStore);
    }
  }, [ukItemChoose, keyAesStore, userDetail, doctor]);

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
              const action = chooseItem({ ...doctor });
              dispatch(action);
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("KhaiBaoYTe");
          }}
        >
          <Card>
            <Text>Khai Báo y tế</Text>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const action = chooseItem({ ...userDetail });
            dispatch(action);
            navigation.navigate("HistoryKhaiBaoYTe");
          }}
        >
          <Card>
            <Text>Lịch sử khai báo y tế</Text>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
