import React, { useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Constants from "expo-constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import moment from "moment";
import firebaseApp from "../../firebase/config.js";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { notification } from "../../network/User";

type FormKhaiBaoYTeScreenProp = StackNavigationProp<
  RootStackParamList,
  "KhaiBaoYTe"
>;

export default function FormKhaiBaoYte() {
  const currentUser = firebaseApp.auth().currentUser;
  const keyAES = useSelector((state: any) => state.KeyAES);
  const itemChoose = useSelector((state: any) => state.chooseItem);
  const userStore = useSelector((state: any) => state.UserStore);
  const navigation = useNavigation<FormKhaiBaoYTeScreenProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Khai Báo y tế",
    });
  }, [navigation]);
  const [data, setData] = useState<any>(null);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      "Họ tên (ghi chữ IN HOA)": "",
      "Số hộ chiếu / CMND / CCCD": "",
      "Năm sinh": "",
      "Giới tính": "",
      "Quốc tịch": "",
      "Tỉnh thành": "",
      "Quận / huyện": "",
      "Phường / xã": "",
      "Số nhà, phố, tổ dân phố/thôn/đội ": "",
    },
  });
  const pushQrKhaiBaoYTe = async (data: any) => {
    console.log("====================================");
    console.log({ keyAES });
    console.log("====================================");
    let key = JSON.parse(keyAES);
    console.log("====================================");
    console.log({ key });
    console.log("====================================");
    let sendData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    let encrypted = CryptoJS.AES.encrypt(sendData, key.key, {
      iv: key.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log(encrypted.toString());
    try {
      await firebaseApp
        .database()
        .ref("QRKhaiBaoYTe/" + `${currentUser.uid}`)
        .push(encrypted.toString());
    } catch (error) {
      console.log(error);
    }
    // try {
    //   await firebaseApp
    //     .database()
    //     .ref("QRKhaiBaoYTe/" + `${currentUser.uid}`)
    //     .push({
    //       ten: data["Họ tên (ghi chữ IN HOA)"],

    //       cmnd: data["Số hộ chiếu / CMND / CCCD"],
    //       namSinh: data["Năm sinh"],
    //       gioiTinh: data["Giới tính"],
    //       quocTich: data["Quốc tịch"],
    //       tinhThanh: data["Tỉnh thành"],
    //       quanHuyen: data["Quận / huyện"],
    //       phuongXa: data["Phường / xã"],
    //       soNha: data["Số nhà, phố, tổ dân phố/thôn/đội "],
    //       time: moment().format("MMMM Do YYYY, h:mm:ss a"),
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const onSubmit = async (data: any) => {
    setData({ ...data, time: moment().format("MMMM Do YYYY, h:mm:ss a") });
    await pushQrKhaiBaoYTe({
      ...data,
      time: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });
    notification(itemChoose.uid, "Khai báo y tế", userStore);
    alert("Khai báo thành công ");
    console.log(data);
  };

  const onChange = (arg: any) => {
    return {
      value: arg.nativeEvent.text,
    };
  };

  console.log("errors", errors);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {data && <QRCode value={JSON.stringify(data)} />}
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <Text style={styles.label}>Họ tên (ghi chữ IN HOA)</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Họ tên (ghi chữ IN HOA)"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Số hộ chiếu / CMND / CCCD</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Số hộ chiếu / CMND / CCCD"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Năm sinh</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Năm sinh"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Giới tính</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Giới tính"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Quốc tịch</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Quốc tịch"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Địa chỉ liên lạc tại Việt Nam</Text>
        <Text style={styles.label}>Tỉnh thành/ Thành phố</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Tỉnh thành"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Quận / huyện</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Quận / huyện"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Phường / xã</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Phường / xã"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Số nhà, phố, tổ dân phố/thôn/đội </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="Số nhà, phố, tổ dân phố/thôn/đội "
          rules={{ required: true }}
        />
        <Text>
          Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng
          lãnh thổ nào (Có thể đi qua nhiều nơi)
        </Text>
        <Text>
          Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các
          dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?
        </Text>
        <View style={styles.button}>
          <Button
            // style={styles.buttonInner}
            // color
            title="SAVE"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  label: {
    color: "white",
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: "#0e101c",
  },
  input: {
    backgroundColor: "white",
    // borderColor: "none",
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});
