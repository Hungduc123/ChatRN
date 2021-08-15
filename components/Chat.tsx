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
      notification(itemChoose.uid, "Bạn có 1 tin nhắn mới", userState);
      UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
      reset({
        sms: "",
      });
    }
    if (
      messagesText.indexOf("bieu hien") > -1 ||
      messagesText.indexOf("biểu hiện") > -1 ||
      messagesText.indexOf("Biểu hiện") > -1 ||
      messagesText.indexOf("Bieu hien") > -1
    ) {
      const newMessage =
        "Thời gian ủ bệnh 2-14 ngày,\n trung bình 5-7 ngày.\n Triệu chứng hay gặp khi khởi phát \n là sốt,ho khan, mệt mỏi và đau cơ. \nMột số trường hợp đau họng,\n nghẹt mũi, chảy nước mũi, đau đầu,\n ho có đờm, nôn và tiêu chảy.";
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
      messagesText.indexOf("biện pháp phòng chống") > -1 ||
      messagesText.indexOf("bien phap phong chong") > -1 ||
      messagesText.indexOf("Bien phap phong chong") > -1 ||
      messagesText.indexOf("Biện pháp phòng chống") > -1
    ) {
      const newMessage =
        "1. Thường xuyên rửa tay đúng cách \nbằng xà phòng dưới vòi nước sạch,\n hoặc bằng dung dịch sát khuẩn \ncó cồn (ít nhất 60% cồn)." +
        "\n 2. Đeo khẩu trang nơi công cộng,\n trên phương tiện giao thông\n công cộng và đến cơ sở y tế." +
        "\n 3. Tránh đưa tay lên mắt, mũi, miệng.\n Che miệng và mũi khi ho hoặc \nhắt hơi bằng khăn giấy, khăn vải,\n khuỷu tay áo." +
        "\n 4. Tăng cường vận động, rèn luyện\n thể lực, dinh dưỡng hợp lý xây dựng \nlối sống lành mạnh." +
        "\n 5. Vệ sinh thông thoáng nhà cửa,\n lau rửa các bề mặt hay tiếp xúc." +
        "\n 6. Nếu bạn có dấu hiệu sốt, \nho, hắt hơi, và khó thở, \nhãy tự cách ly tại nhà,\n đeo khẩu trang và gọi cho cơ sở y tế \ngần nhất để được tư vấn,\nkhám và điều trị." +
        "\n 7. Tự cách ly, theo dõi sức khỏe,\n khai báo y tế đầy đủ nếu\n trở về từ vùng dịch." +
        "\n 8. Thực hiện khai báo y tế trực tuyến\n tại https://tokhaiyte.vn hoặc \ntải ứng dụng NCOVI từ \nđịa chỉ https://ncovi.vn\n và thường xuyên cập nhật tình trạng \nsức khoẻ của bản thân." +
        "\n 9. Cài đặt ứng dụng Bluezone để \n được cảnh báonguy cơ lây nhiễm \nCOVID-19, giúp bảo vệ bản thân \nvà gia đình:\nhttps://www.bluezone.gov.vn/.";
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
      (messagesText.indexOf("số") > -1 &&
        messagesText.indexOf("nhiễm") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("Số") > -1 &&
        messagesText.indexOf("nhiễm") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("nhiem") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `Số ca nhiễm tại Việt Nam là ${soNhiem} \nđã cập nhật \n vào ${dayUpdate}`;
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
      (messagesText.indexOf("số") > -1 &&
        messagesText.indexOf("hồi phục") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("Số") > -1 &&
        messagesText.indexOf("hồi phục") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("hoi phuc") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `Số ca hồi phục tại Việt Nam là ${soHoiPhuc} \nđã cập nhật \n vào ${dayUpdate}`;
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
      (messagesText.indexOf("số") > -1 &&
        messagesText.indexOf("đang điều trị") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("Số") > -1 &&
        messagesText.indexOf("đang điều trị") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("dang dieu tri") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `Số ca đang điều trị tại Việt Nam \nlà ${soDangDieuTri} đã cập nhật \n vào ${dayUpdate}`;
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
      (messagesText.indexOf("số") > -1 &&
        messagesText.indexOf("tử vong") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("Số") > -1 &&
        messagesText.indexOf("tử vong") > -1 &&
        messagesText.indexOf("Việt Nam") > -1) ||
      (messagesText.indexOf("So") > -1 &&
        messagesText.indexOf("tu vong") > -1 &&
        messagesText.indexOf("Viet Nam") > -1)
    ) {
      const newMessage = `Số ca tử vong tại Việt Nam là ${soTuVong}\nđã cập nhật \n vào ${dayUpdate}`;
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
                  handleSend("Biểu hiện COVID", "sms");
                }}
                title="Biểu hiện COVID"
                type="outline"
              />
              <Button
                onPress={() => {
                  handleSend("Biện pháp phòng chống", "sms");
                }}
                title="Biện pháp phòng chống"
                type="outline"
              />
              <Button
                onPress={() => {
                  Linking.openURL("tel:19009095");
                }}
                title="Gọi 19009095"
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
