import React, { useEffect, useLayoutEffect, useState } from "react";
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

import moment from "moment";
import { UpdateUser } from "../network/User";
import colors from "../colors/colors";

type HomeScreenProp = StackNavigationProp<RootStackParamList, "Setting">;

export default function Setting() {
  const navigation = useNavigation<HomeScreenProp>();
  const currentUser = firebaseApp.auth().currentUser;
  useEffect(() => {
    UpdateUser(currentUser.uid, moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Setting",
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 30 }}>Setting</Text>
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
        <Text style={{ color: colors.first, fontSize: 20 }}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
