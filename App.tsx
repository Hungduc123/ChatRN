import React from "react";

import Login from "./components/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NativeRouter } from "react-router-native";
import Register from "./components/Register";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./components/RootStackParamList";
import { TouchableOpacity, Text } from "react-native";

import ListFriend from "./components/ListFriend";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Setting from "./components/Setting";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import store from "./store";
import Chat from "./components/Chat";
import ListChat from "./components/ListChat";
import Tracking from "./components/Tracking";
import KhaiBaoYTe from "./components/FormKhaiBaoYte";
import HistoryKhaiBaoYTe from "./components/HistoryKhaiBaoYTe";
import Home from "./components/Screen/Home";
import DataInVietNam from "./components/DataInVietNam";
import KhaiBaoOrChat from "./components/KhaiBaoOrChat";
import Notification from "./components/Notification";

import firebaseApp from "./firebase/config.js";
import Test from "./components/Test";
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  function HomeStack() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Information") {
              iconName = focused
                ? "ios-information-circle"
                : "ios-information-circle-outline";
            } else if (route.name === "Setting") {
              iconName = focused ? "list" : "ios-list";
            } else if (route.name === "Tracking") {
              iconName = focused ? "bar-chart" : "bar-chart-outline";
            } else if (route.name === "Notification") {
              iconName = focused
                ? "ios-notifications-circle"
                : "ios-notifications-circle-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#563CCF",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Information" component={ListFriend} />
        <Tab.Screen name="Tracking" component={Tracking} />
        <Tab.Screen name="Notification" component={Notification} />

        <Tab.Screen name="Setting" component={Setting} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Test" component={Test} />

          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="Home"
            component={HomeStack}
            options={{
              headerLeft: () => {
                return <></>;
              },
            }}
          />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ListChat" component={ListChat} />
          <Stack.Screen name="KhaiBaoYTe" component={KhaiBaoYTe} />
          <Stack.Screen name="Homes" component={Home} />
          <Stack.Screen name="DataInVietNam" component={DataInVietNam} />
          <Tab.Screen name="KhaiBaoOrChat" component={KhaiBaoOrChat} />
          <Stack.Screen
            name="HistoryKhaiBaoYTe"
            component={HistoryKhaiBaoYTe}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
