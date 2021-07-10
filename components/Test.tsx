import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
export default function Test() {
  const [picture, setPicture] = useState<any>({});
  let openImagePickerAsync = async () => {
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
    const manipResult = await ImageManipulator.manipulateAsync(
      pickerResult.uri,
      [{ resize: { width: 200, height: 200 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    ///////////////
    ////
    console.log("====================================");
    console.log({ manipResult });
    console.log("====================================");
    setPicture(manipResult);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
      <Image
        style={{ width: 300, height: 300 }}
        source={{ uri: `data:image/jpeg;base64,${picture.base64}` }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 20,
  },
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
});
