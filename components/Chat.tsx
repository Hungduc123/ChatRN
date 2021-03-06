import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
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
  Modal,
  Linking,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import colors from "../colors/colors";
import styles from "../styles/styles";
import { RootStackParamList } from "./RootStackParamList";

import firebaseApp from "../firebase/config.js";
import typeMessage from "../data/typeMessage";
// import userCurrent from "../network/userCurrent";
import { receiverMsg, senderMsg } from "../network/message";
// import { Avatar } from "react-native-elements";
import { Avatar } from "react-native-paper";
import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeUk } from "../data/key";
import moment from "moment";
import { notification, UpdateMsg, UpdateUser } from "../network/User";
import { Controller, useForm } from "react-hook-form";
import { Button, Chip } from "react-native-elements";
import { SpeedDial } from "react-native-elements";
import { getDetail } from "../apis";
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
  const [img, setImg] = useState<string>("");
  // //////////
  // const [keyAesStore, setKeyAesStore] = useState<any>(null);
  // const [keyAesEncrypted, setKeyAesEncrypted] = useState<any>(null);
  // const [ukItemChoose, setUkItemChoose] = useState<any>(null);
  const [keyAesDatabase, setKeyAesDatabase] = useState<any>(null);
  // const [keyAESFinal, setKeyAESFinal] = useState<any>(
  //   keyAES ? JSON.parse(keyAES) : null
  // );
  // const keyAESFinal = useSelector((state: any) => state.KeyAES);
  const [soNhiem, setSoNhiem] = useState<string | null>(null);
  const [soDangDieuTri, setSoDangDieuTri] = useState<string | null>(null);
  const [soHoiPhuc, setSoHoiPhuc] = useState<string | null>(null);
  const [soTuVong, setSoTuVong] = useState<string | null>(null);
  const [dayUpdate, setDayUpdate] = useState<string | null>(null);

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
  useEffect(() => {
    const doIt = async () => {
      await getDetail().then((res) => {
        setDayUpdate(
          moment(res.data.lastUpdatedAtApify).format("MMMM Do YYYY, h:mm:ss a")
        );
        setSoNhiem(res.data.infected);
        setSoDangDieuTri(res.data.treated);

        setSoHoiPhuc(res.data.recovered);

        setSoTuVong(res.data.deceased);
      });
    };
    doIt();
  }, []);
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
      <>
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
            }}
          >
            {props.it.sendBy !== currentUser.uid && (
              // <Avatar
              //   size="small"
              //   rounded
              //   source={{
              //     uri: "https://e7.pngegg.com/pngimages/505/761/png-clipart-login-computer-icons-avatar-icon-monochrome-black-thumbnail.png",
              //   }}
              // />
              <Avatar.Text
                size={40}
                label={itemChoose.name
                  .split(" ")
                  .map((word: any) => word.slice(0, 1))
                  .join("")}
              />
            )}
            {props.it.type === "sms" ? (
              <Text style={{ padding: 10, fontSize: 20 }}>{props.it.msg}</Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setChoose(!choose);
                  setImg(`data:image/jpeg;base64,${props.it.msg}`);
                }}
              >
                <Image
                  style={{
                    width: 300,
                    height: 400,
                    padding: 10,
                    borderRadius: 20,
                  }}
                  source={{ uri: `data:image/jpeg;base64,${props.it.msg}` }}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={{ color: colors.first }}>{props.it.time}</Text>
        </Card>
        {choose && (
          <Modal style={{ flex: 1 }} animationType="slide">
            <SafeAreaView
              style={{
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => {
                  setChoose(!choose);
                }}
              >
                <MaterialIcons name="cancel" size={24} color="black" />
              </TouchableOpacity>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  style={{
                    width: 300 + 100,
                    height: 400 + 200,
                    padding: 10,
                    borderRadius: 20,
                  }}
                  source={{ uri: img }}
                />
              </View>
            </SafeAreaView>
          </Modal>
        )}
      </>
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
      notification(itemChoose.uid, "B???n c?? 1 tin nh???n m???i", userState);
      UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
      reset({
        sms: "",
      });
    }
    if (
      messagesText.indexOf("bieu hien") > -1 ||
      messagesText.indexOf("bi???u hi???n") > -1 ||
      messagesText.indexOf("Bi???u hi???n") > -1 ||
      messagesText.indexOf("Bieu hien") > -1
    ) {
      const newMessage =
        "Th???i gian ??? b???nh 2-14 ng??y,\n trung b??nh 5-7 ng??y.\n Tri???u ch???ng hay g???p khi kh???i ph??t \n l?? s???t,ho khan, m???t m???i v?? ??au c??. \nM???t s??? tr?????ng h???p ??au h???ng,\n ngh???t m??i, ch???y n?????c m??i, ??au ?????u,\n ho c?? ?????m, n??n v?? ti??u ch???y.";
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(newMessage);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        itemChoose.uid,
        currentUser.uid,
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
        itemChoose.uid,
        currentUser.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));
    }
    if (
      messagesText.indexOf("bi???n ph??p ph??ng ch???ng") > -1 ||
      messagesText.indexOf("bien phap phong chong") > -1 ||
      messagesText.indexOf("Bien phap phong chong") > -1 ||
      messagesText.indexOf("Bi???n ph??p ph??ng ch???ng") > -1
    ) {
      const newMessage =
        "1. Th?????ng xuy??n r???a tay ????ng c??ch \nb???ng x?? ph??ng d?????i v??i n?????c s???ch,\n ho???c b???ng dung d???ch s??t khu???n \nc?? c???n (??t nh???t 60% c???n)." +
        "\n 2. ??eo kh???u trang n??i c??ng c???ng,\n tr??n ph????ng ti???n giao th??ng\n c??ng c???ng v?? ?????n c?? s??? y t???." +
        "\n 3. Tr??nh ????a tay l??n m???t, m??i, mi???ng.\n Che mi???ng v?? m??i khi ho ho???c \nh???t h??i b???ng kh??n gi???y, kh??n v???i,\n khu???u tay ??o." +
        "\n 4. T??ng c?????ng v???n ?????ng, r??n luy???n\n th??? l???c, dinh d?????ng h???p l?? x??y d???ng \nl???i s???ng l??nh m???nh." +
        "\n 5. V??? sinh th??ng tho??ng nh?? c???a,\n lau r???a c??c b??? m???t hay ti???p x??c." +
        "\n 6. N???u b???n c?? d???u hi???u s???t, \nho, h???t h??i, v?? kh?? th???, \nh??y t??? c??ch ly t???i nh??,\n ??eo kh???u trang v?? g???i cho c?? s??? y t??? \ng???n nh???t ????? ???????c t?? v???n,\nkh??m v?? ??i???u tr???." +
        "\n 7. T??? c??ch ly, theo d??i s???c kh???e,\n khai b??o y t??? ?????y ????? n???u\n tr??? v??? t??? v??ng d???ch." +
        "\n 8. Th???c hi???n khai b??o y t??? tr???c tuy???n\n t???i https://tokhaiyte.vn ho???c \nt???i ???ng d???ng NCOVI t??? \n?????a ch??? https://ncovi.vn\n v?? th?????ng xuy??n c???p nh???t t??nh tr???ng \ns???c kho??? c???a b???n th??n." +
        "\n 9. C??i ?????t ???ng d???ng Bluezone ????? \n ???????c c???nh b??onguy c?? l??y nhi???m \nCOVID-19, gi??p b???o v??? b???n th??n \nv?? gia ????nh:\nhttps://www.bluezone.gov.vn/.";
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(newMessage);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        itemChoose.uid,
        currentUser.uid,
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
        itemChoose.uid,
        currentUser.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));
    }
    if (
      (messagesText.indexOf("so") > -1 &&
        messagesText.indexOf("nhiem") > -1 &&
        messagesText.indexOf("Viet Nam") > -1) ||
      (messagesText.indexOf("s???") > -1 &&
        messagesText.indexOf("nhi???m") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("S???") > -1 &&
        messagesText.indexOf("nhi???m") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("nhiem") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `S??? ca nhi???m t???i Vi???t Nam l?? ${soNhiem} \n???? c???p nh???t \n v??o ${dayUpdate}`;
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(newMessage);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        itemChoose.uid,
        currentUser.uid,
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
        itemChoose.uid,
        currentUser.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));
    }
    if (
      (messagesText.indexOf("so") > -1 &&
        messagesText.indexOf("hoi phuc") > -1 &&
        messagesText.indexOf("Viet Nam") > -1) ||
      (messagesText.indexOf("s???") > -1 &&
        messagesText.indexOf("h???i ph???c") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("S???") > -1 &&
        messagesText.indexOf("h???i ph???c") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("hoi phuc") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `S??? ca h???i ph???c t???i Vi???t Nam l?? ${soHoiPhuc} \n???? c???p nh???t \n v??o ${dayUpdate}`;
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(newMessage);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        itemChoose.uid,
        currentUser.uid,
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
        itemChoose.uid,
        currentUser.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));
    }
    if (
      (messagesText.indexOf("so") > -1 &&
        messagesText.indexOf("dang dieu tri") > -1 &&
        messagesText.indexOf("Viet Nam") > -1) ||
      (messagesText.indexOf("s???") > -1 &&
        messagesText.indexOf("??ang ??i???u tr???") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("S???") > -1 &&
        messagesText.indexOf("??ang ??i???u tr???") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("dang dieu tri") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `S??? ca ??ang ??i???u tr??? t???i Vi???t Nam \nl?? ${soDangDieuTri} ???? c???p nh???t \n v??o ${dayUpdate}`;
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(newMessage);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        itemChoose.uid,
        currentUser.uid,
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
        itemChoose.uid,
        currentUser.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));
    }
    if (
      (messagesText.indexOf("so") > -1 &&
        messagesText.indexOf("tu vong") > -1 &&
        messagesText.indexOf("Viet Nam") > -1) ||
      (messagesText.indexOf("s???") > -1 &&
        messagesText.indexOf("t??? vong") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("S???") > -1 &&
        messagesText.indexOf("t??? vong") > -1 &&
        messagesText.indexOf("Vi???t Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("tu vong") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `S??? ca t??? vong t???i Vi???t Nam l?? ${soTuVong}\n???? c???p nh???t \n v??o ${dayUpdate}`;
      let key = JSON.parse(keyAES);
      let sendData = CryptoJS.enc.Utf8.parse(newMessage);
      console.log({ key });

      let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
        iv: key.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log(encrypted.toString());

      senderMsg(
        encrypted.toString(),
        itemChoose.uid,
        currentUser.uid,
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
        itemChoose.uid,
        currentUser.uid,
        "",
        moment().format("MMMM Do YYYY, h:mm:ss a"),
        type
      )
        .then(() => {})
        .catch((err: any) => alert(err));
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
      [{ resize: { width: 300, height: 400 } }],
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
            style={{ backgroundColor: "#8071d1" }}
            inverted
            data={messages}
            keyExtractor={(item) => JSON.stringify(item)}
            renderItem={({ item }) => <RenderChatBox it={item} />}
          />
          {itemChoose.isDoctored && (
            <>
              <Button
                onPress={() => {
                  handleSend("Bi???u hi???n COVID", "sms");
                }}
                title="Bi???u hi???n COVID"
                type="outline"
              />
              <Button
                onPress={() => {
                  handleSend("Bi???n ph??p ph??ng ch???ng", "sms");
                }}
                title="Bi???n ph??p ph??ng ch???ng"
                type="outline"
              />
              <Button
                onPress={() => {
                  Linking.openURL("tel:19009095");
                }}
                title="G???i 19009095"
                type="clear"
              />
            </>
          )}

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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
