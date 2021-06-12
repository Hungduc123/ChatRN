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
} from "react-native";
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
// import AsyncStorage from "@react-native-community/async-storage";
type authScreenProp = StackNavigationProp<RootStackParamList, "Login">;

function Login() {
  const navigation = useNavigation<authScreenProp>();
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [publicKeyGlobal, setPublicKeyGlobal] = useState<TypeUk | null>(null);
  const [privateKeyGlobal, setPrivateKeyGlobal] = useState<TypePk | null>(null);

  const dispatch = useDispatch();

  const genKey = (user: any) => {
    var RSAKey = require("react-native-rsa");
    const bits = 1024;
    const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
    var rsa = new RSAKey();
    rsa.generate(bits, exponent);
    var publicKey: TypeUk = JSON.parse(rsa.getPublicString()); // return json encoded string
    // setPublicKeyGlobal(publicKey);
    var privateKey: TypePk = JSON.parse(rsa.getPrivateString()); // return json encoded string
    // setPrivateKeyGlobal(privateKey);
    console.log("publicKey +---------------------------------------------");

    console.log(publicKey);
    console.log("privateKey---------------------------------------------");

    console.log(privateKey);

    const actionUk = PublicKey({
      e: publicKey.e,
      n: publicKey.n,
    });
    const actionPk = PrivateKey({
      n: privateKey.n,
      e: privateKey.e,
      d: privateKey.d,
      p: privateKey.p,
      q: privateKey.q,
      dmp1: privateKey.dmp1,
      dmq1: privateKey.dmq1,
      coeff: privateKey.coeff,
    });
    dispatch(actionPk);
    dispatch(actionUk);
    pushKey(user, publicKey);
  };
  const pushKey = (user: any, publicKey: TypeUk) => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    try {
      firebaseApp
        .database()
        .ref("publicKey/" + user.uid)
        .set({
          n: publicKey.n,
          e: publicKey.e,
        });
    } catch (error) {
      console.log(error);
    }
    ////////////////////////////////////////////////////////////////////
  };
  const login = () => {
    setLoading(true);
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential: any) => {
        var user = userCredential.user;
        console.log("login complete");
        setLoading(false);
        setEmail("");
        setPassword("");

        navigation.navigate("Home");
        genKey(user);

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
  };

  // const storeKey = async (
  //   publicKey: TypeUk | null,
  //   privateKey: TypePk | null
  // ) => {
  //   try {
  //     const jsonPublicKey = JSON.stringify(publicKey);
  //     const jsonPrivateKey = JSON.stringify(privateKey);

  //     await AsyncStorage.setItem("publicKey", jsonPublicKey);
  //     await AsyncStorage.setItem("publicKey", jsonPrivateKey);
  //     const u = await AsyncStorage.getItem("publicKey");
  //     const p = await AsyncStorage.getItem("publicKey");
  //     console.log("u" + u + "-----------------------------------");

  //     console.log("p" + p + "-----------------------------------");
  //   } catch (e) {
  //     // saving error
  //   }
  // };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
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
              color: "#CC6666",
              paddingBottom: 10,
            }}
          >
            Welcome
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
              shadowColor: colors.first,
            }}
          >
            <Text style={{ color: colors.first }}>User Name: </Text>
            <TextInput
              textAlign="center"
              onChangeText={(Value) => setEmail(Value)}
              style={{
                height: 40,
                width: 200,
                borderColor: colors.first,

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
              shadowColor: colors.first,
            }}
          >
            <Text style={{ color: colors.first }}>Password:</Text>
            <TextInput
              textAlign="center"
              onChangeText={(Value) => setPassword(Value)}
              style={{
                height: 40,
                width: 200,
                borderColor: colors.first,
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
              login();
            }}
            style={{
              backgroundColor: "orange",

              borderRadius: 20,
              width: 100,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
              setEmail("");
              setPassword("");
            }}
            style={{
              backgroundColor: "orange",
              borderRadius: 20,
              width: 100,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Register</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <Modal animationType="fade" transparent={true} visible={loading}>
            <Loading></Loading>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;
