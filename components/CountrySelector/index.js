import React from "react";
import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function CountrySelector({ countries, handleOnChange, value }) {
  console.log("====================================");
  console.log("CountrySelector");
  console.log("====================================");
  let it = [];
  countries.forEach((element) => {
    it.push({ label: element.Country, value: element.ISO2 });
  });
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <RNPickerSelect
        style={{ color: "black" }}
        useNativeAndroidPickerStyle={false}
        // onChange={(value) => {
        //   handleOnChange(value);
        // }}
        value={value}
        onValueChange={
          (value) => {
            handleOnChange(value);
          }
          // console.log(value)}
        }
        items={it}
      />
    </View>
  );
}
