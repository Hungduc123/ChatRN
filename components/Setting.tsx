import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "../styles/styles";
import firebaseApp from "../firebase/config.js";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeScreenProp = StackNavigationProp<RootStackParamList, "Register">;

export default function Setting() {
  const navigation = useNavigation<HomeScreenProp>();
  const currentUser = firebaseApp.auth().currentUser;
  const [email, setEmail] = useState<string>(
    JSON.stringify(firebaseApp.auth().currentUser)
  );
  const key = useSelector((state: any) => state.PrivateKey);

  return (
    <SafeAreaView style={styles.container}>
      <Text>setting</Text>
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Notification", "Do you want logout", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                firebaseApp
                  .auth()
                  .signOut()
                  .then(async () => {
                    navigation.navigate("Login");

                    console.log("User signed out!");
                    try {
                      await AsyncStorage.setItem("publicKey", "");
                      await AsyncStorage.setItem("publicKey", "");
                      const u = await AsyncStorage.getItem("publicKey");
                      const p = await AsyncStorage.getItem("publicKey");
                      console.log(
                        "u_logout" + u + "-----------------------------------"
                      );

                      console.log(
                        "p_logout" + p + "-----------------------------------"
                      );
                    } catch (e) {
                      // saving error
                    }
                    try {
                      firebaseApp
                        .database()
                        .ref("publicKey/" + currentUser.uid)
                        .set({
                          n: "",
                          e: "",
                        });
                    } catch (error) {
                      console.log(error);
                    }
                  });
              },
            },
          ]);
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text>{key.d}</Text>
    </SafeAreaView>
  );
}
