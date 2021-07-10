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
  Modal,
  SafeAreaView,
  TouchableOpacity,
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
import { Card } from "native-base";
import colors from "../../colors/colors";
import { AntDesign } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
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
  const [checked1, setChecked1] = useState<boolean>(false);
  const [checked2, setChecked2] = useState<boolean>(false);

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
  const onSubmit = (data: any) => {
    setData({
      ...data,
      time: moment().format("MMMM Do YYYY, h:mm:ss a"),
      "Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng lãnh thổ nào (Có thể đi qua nhiều nơi)":
        checked1,
      "Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?":
        checked2,
    });

    reset({
      "Họ tên (ghi chữ IN HOA)": "",
      "Số hộ chiếu / CMND / CCCD": "",
      "Năm sinh": "",
      "Giới tính": "",
      "Quốc tịch": "",
      "Tỉnh thành": "",
      "Quận / huyện": "",
      "Phường / xã": "",
      "Số nhà, phố, tổ dân phố/thôn/đội ": "",
    });
    setChecked2(false);
    setChecked1(false);
    console.log({
      ...data,
      time: moment().format("MMMM Do YYYY, h:mm:ss a"),
      "Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng lãnh thổ nào (Có thể đi qua nhiều nơi)":
        checked1,
      "Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?":
        checked2,
    });
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
      {data !== null && (
        <Modal
          animationType="slide"
          visible={data !== null}
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Card
              style={{
                flex: 1,
                justifyContent: "space-around",
                alignItems: "center",
                borderRadius: 20,
                shadowColor: colors.first,
                width: "90%",
              }}
            >
              <TouchableOpacity onPress={() => setData(null)}>
                <AntDesign name="back" size={24} color={colors.first} />
              </TouchableOpacity>
              <Text style={{ color: colors.first, fontSize: 30 }}>
                Kết Quả Khai Báo Y Tế{" "}
              </Text>
              <QRCode value={JSON.stringify(data)} />

              <Text>Họ tên: {data["Họ tên (ghi chữ IN HOA)"]}</Text>
              <Text>
                Số hộ chiếu / CMND / CCCD: {data["Số hộ chiếu / CMND / CCCD"]}
              </Text>
              <Text>Năm sinh: {data["Năm sinh"]}</Text>
              <Text>Giới tính: {data["Giới tính"]}</Text>
              <Text>Quốc tịch: {data["Quốc tịch"]}</Text>
              <Text>Tỉnh thành: {data["Tỉnh thành"]}</Text>
              <Text>Quận / huyện: {data["Quận / huyện"]}</Text>
              <Text>Phường / xã: {data["Phường / xã"]}</Text>
              <Text>
                Số nhà, phố, tổ dân phố/thôn/đội:{" "}
                {data["Số nhà, phố, tổ dân phố/thôn/đội "]}
              </Text>
              <Text>
                Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc
                gia/vùng lãnh thổ nào "("Có thể đi qua nhiều nơi")":{" "}
                {data[
                  "Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng lãnh thổ nào (Có thể đi qua nhiều nơi)"
                ]
                  ? " có"
                  : " Không"}
              </Text>
              <Text>
                Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1
                trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt
                mỏi không?:
                {data[
                  "Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?"
                ]
                  ? " có"
                  : " Không"}
              </Text>

              <TouchableOpacity
                onPress={async () => {
                  await pushQrKhaiBaoYTe({
                    ...data,
                  });
                  notification(itemChoose.uid, "Khai báo y tế", userStore);
                  alert("Khai báo y tế thành công");
                  setData(null);
                }}
              >
                <View
                  style={{
                    height: 50,
                    width: 100,
                    backgroundColor: colors.first,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 15,
                  }}
                >
                  <Text>SUBMIT</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </SafeAreaView>
        </Modal>
      )}
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
          defaultValue=""
          rules={{ required: true }}
        />
        {errors["Họ tên (ghi chữ IN HOA)"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}

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
        {errors["Số hộ chiếu / CMND / CCCD"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Năm sinh"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Giới tính"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Quốc tịch"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Tỉnh thành"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Quận / huyện"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Phường / xã"] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}
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
        {errors["Số nhà, phố, tổ dân phố/thôn/đội "] && (
          <Text style={{ color: "red" }}>This is required.</Text>
        )}

        <Checkbox.Item
          label="Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng
          lãnh thổ nào (Có thể đi qua nhiều nơi)"
          status={checked1 ? "checked" : "unchecked"}
          onPress={() => {
            setChecked1(!checked1);
          }}
        />
        <Checkbox.Item
          label="Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các
          dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi không?"
          status={checked2 ? "checked" : "unchecked"}
          onPress={() => {
            setChecked2(!checked2);
          }}
        />
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
    backgroundColor: "#8071d1",
  },
  input: {
    backgroundColor: "white",
    // borderColor: "none",
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});
