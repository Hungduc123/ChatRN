import { Card } from "native-base";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  ToastAndroid,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useHistory } from "react-router-dom";
import colors from "../colors/colors";
import styles from "../styles/styles";
import firebaseApp from "../firebase/config.js";
import Loading from "./Loading";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { CurrentUser } from "../slice/CurrentUser";
import { useDispatch } from "react-redux";
import { log } from "react-native-reanimated";
import { TypePk, TypeUk } from "../data/key";
import { PublicKey } from "../slice/PublicKey";
import { PrivateKey } from "../slice/PrivateKey";
import dataUser from "../data/dataUser";
import { AntDesign } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-community/async-storage";
import typeAccountDoctor from "../data/typeAccountDoctor";
import { AccountDoctorLogin } from "../slice/accountDoctor";
import CountrySelector from "./CountrySelector";
type authScreenProp = StackNavigationProp<RootStackParamList, "Login">;

function Login() {
  const navigation = useNavigation<authScreenProp>();
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [publicKeyGlobal, setPublicKeyGlobal] = useState<TypeUk | null>(null);
  const [privateKeyGlobal, setPrivateKeyGlobal] = useState<TypePk | null>(null);
  const [openCheckIsDoctor, setOpenCheckIsDoctor] = useState<boolean>(false);
  const [codeIsDoctor, setCodeIsDoctor] = useState<string>("");
  const [loginAsDoctor, setLoginAsDoctor] = useState<boolean>(false);
  const [accountDoctor, setAccountDoctor] = useState<typeAccountDoctor | null>(
    null
  );

  const dispatch = useDispatch();

  const login = () => {
    setLoading(true);
    if (loginAsDoctor) {
      try {
        firebaseApp
          .database()
          .ref("doctors")
          .on("value", (dataSnapshot: any) => {
            let tempAccountDoctor = { ...dataSnapshot };
            console.log("====================================");
            console.log("tempAccountDoctor");
            console.log(tempAccountDoctor);

            console.log("====================================");
            if (
              { email, password }.toString() === tempAccountDoctor.toString()
            ) {
              const action = AccountDoctorLogin(tempAccountDoctor.toString());
              dispatch(action);
              setLoading(false);
              setEmail("");
              setPassword("");
              navigation.navigate("Home");
            }
            // setAccountDoctor(tempAccountDoctor);
          });
      } catch (error) {
        alert(error);
      }
    } else {
      firebaseApp
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential: any) => {
          var user = userCredential.user;
          console.log("login complete");
          setLoading(false);
          setEmail("");
          setPassword("");
          const action = AccountDoctorLogin(null);
          dispatch(action);
          navigation.navigate("Home");
          // genKey(user);

          // storeKey(publicKeyGlobal, privateKeyGlobal);
          alert("login complete");
        })
        .catch((error: any) => {
          if (error.code === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
            setLoading(false);
            alert("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            console.log("That email address is invalid!");
            setLoading(false);
            alert("That email address is invalid!");
          }
          setLoading(false);
          alert("wrong");
          console.error(error);
        });
    }
  };

  const checkDoctor = (code: string) => {
    if (code === "12345") {
      setLoginAsDoctor(true);
      // Toast.show("Complete, You are a Doctor");
      alert("Complete, You are a Doctor");
      setCodeIsDoctor("");
      setOpenCheckIsDoctor(false);
    } else {
      setCodeIsDoctor("");
      alert("Wrong Code");
      // Toast.show("Wrong Code");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image
          source={require("../assets/lifesavers_bust.png")}
          style={{ width: 300, height: 300 }}
        ></Image>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "skyblue",
              paddingBottom: 10,
            }}
          >
            Welcome
            {/* Welcome {loginAsDoctor ? "Doctor" : "User"} */}
          </Text>
        </View>
        <Card
          style={{
            borderRadius: 20,
            width: "90%",
            padding: 10,
          }}
        >
          <Card
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 20,
              shadowColor: "skyblue",
            }}
          >
            <Text style={{ color: "skyblue" }}>User Name: </Text>
            <TextInput
              textAlign="center"
              onChangeText={(Value) => setEmail(Value)}
              style={{
                height: 40,
                width: 200,
                borderColor: "skyblue",

                borderWidth: 1,
                // backgroundColor: "#ADDFFF",

                borderRadius: 30,
              }}
              placeholderTextColor="gray"
              placeholder="Enter your user name"
              value={email}
            />
          </Card>
          <Card
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 20,
              shadowColor: "skyblue",
            }}
          >
            <Text style={{ color: "skyblue" }}>Password:</Text>
            <TextInput
              textAlign="center"
              onChangeText={(Value) => setPassword(Value)}
              style={{
                height: 40,
                width: 200,
                borderColor: "skyblue",
                borderWidth: 1,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              placeholderTextColor="gray"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
            />
          </Card>
        </Card>
        <View
          style={{
            flexDirection: "row",
            paddingTop: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (password.length !== 0 && email.length !== 0) {
                login();
              } else alert("Vui lòng điền đủ thông tin");
            }}
            style={{
              backgroundColor: "skyblue",

              borderRadius: 20,
              width: 100,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Đăng Nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
              setEmail("");
              setPassword("");
            }}
            style={{
              backgroundColor: "skyblue",
              borderRadius: 20,
              width: 100,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Đăng Ký</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          onPress={() => {
            setOpenCheckIsDoctor(true);
          }}
        >
          <Text>Are you a doctor? Press Here </Text>
        </TouchableOpacity> */}
        {openCheckIsDoctor && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={openCheckIsDoctor}
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <SafeAreaView
              style={{
                flex: 1,
                // justifyContent: "space-around",
                alignItems: "center",
                top: "10%",
              }}
            >
              <Card
                style={{
                  flex: 0.2,
                  justifyContent: "space-around",
                  alignItems: "center",
                  borderRadius: 20,
                  shadowColor: "skyblue",
                  width: "90%",
                }}
              >
                <TouchableOpacity
                  style={{
                    left: 20,
                    top: 20,
                    position: "absolute",
                  }}
                  onPress={() => setOpenCheckIsDoctor(false)}
                >
                  <AntDesign name="back" size={24} color="skyblue" />
                </TouchableOpacity>
                <Text style={{ color: "skyblue", fontSize: 30 }}>CODE</Text>
                <TextInput
                  textAlign="center"
                  onChangeText={(Value) => setCodeIsDoctor(Value)}
                  style={{
                    height: 40,
                    width: 200,
                    borderColor: "skyblue",
                    borderWidth: 1,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                  placeholderTextColor="gray"
                  placeholder="Enter your Code"
                  secureTextEntry
                  value={codeIsDoctor}
                />
                <TouchableOpacity
                  onPress={() => {
                    checkDoctor(codeIsDoctor);
                  }}
                  style={{
                    backgroundColor: "skyblue",
                    borderRadius: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Enter</Text>
                </TouchableOpacity>
              </Card>
            </SafeAreaView>
          </Modal>
        )}
        {loading && (
          <Modal animationType="fade" transparent={true} visible={loading}>
            <Loading name="đăng nhập"></Loading>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;
