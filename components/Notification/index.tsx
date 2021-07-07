import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { RootStackParamList } from "../RootStackParamList";
import firebaseApp from "../../firebase/config.js";
import _ from "lodash";
import { Avatar } from "react-native-elements";
import { chooseItem } from "../../slice/chooseItem";
import { Card } from "native-base";
import { Entypo, Feather } from "@expo/vector-icons";
import firebase from "firebase";
type NotificationScreenProp = StackNavigationProp<
  RootStackParamList,
  "Notification"
>;

export default function Notification() {
  const navigation = useNavigation<NotificationScreenProp>();
  const userCurrent = firebaseApp.auth().currentUser;
  const [allNotifications, setAllNotifications] = useState<any>([]);
  useEffect(() => {
    let onValueChange: any;
    try {
      onValueChange = firebaseApp
        .database()
        .ref("/Notification")
        .child(userCurrent.uid)
        .on("value", (snapshot: any) => {
          let notification: any[] = [];
          snapshot.forEach((child: any) => {
            if (userCurrent.uid !== child.val().uid) {
              notification.push({
                ...child.val(),
              });
            }
          });
          console.log({ notification });

          setAllNotifications(_.sortBy(notification, "time").reverse());
        });
    } catch (error) {
      console.log(error);
    }
    return () =>
      firebaseApp
        .database()
        .ref("/Notification")
        .child(userCurrent.uid)
        .off("value", onValueChange);
  }, []);
  const RenderItem = (props: any) => {
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={async () => {
          // await getUkRSA(props.it).then((tempUkReceiver) => {
          //   enCodeRSA(tempUkReceiver).then((encrypted) => {
          //     sendRSA(encrypted, props.it);
          //   });
          // });

          const action = chooseItem(props.it.Sender);
          dispatch(action);
          navigation.navigate("KhaiBaoOrChat");
        }}
      >
        <Card style={{ width: "90%", borderRadius: 10, padding: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text>
                {props.it.notification} từ {props.it.Sender.name}
              </Text>
              <Text>vào {props.it.time}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: "flex-end", padding: 20 }}>
        <TouchableOpacity
          onPress={async () => {
            await firebaseApp
              .database()
              .ref(`/Notification/${userCurrent.uid}`)
              .remove();
          }}
        >
          <Feather name="trash-2" size={30} color="#563CCF" />
        </TouchableOpacity>
      </View>
      {allNotifications.toString() === [].toString() && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Bạn không có thông báo trước đó</Text>
          <Entypo name="notifications-off" size={150} color="#563CCF" />
        </View>
      )}
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={allNotifications}
        keyExtractor={(item) => item.time!.toString()}
        renderItem={({ item }) => <RenderItem it={item}></RenderItem>}
      ></FlatList>
    </SafeAreaView>
  );
}
function dispatch(action: { payload: any; type: string }) {
  throw new Error("Function not implemented.");
}