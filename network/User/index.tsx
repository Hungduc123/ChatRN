import firebaseApp from "../../firebase/config";
import typeMessage from "../../data/typeMessage";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import moment from "moment";
export const AddUser = async (
  name: string,
  email: string,
  uid: string,
  profileImg: string,
  isDoctored: boolean
) => {
  let friends: FirebaseAuthTypes.User[] = [];
  try {
    return await firebaseApp
      .database()
      .ref("users/" + uid)
      .set({
        name: name,
        email: email,
        uid: uid,
        profileImg: profileImg,
        friends: friends,
        isDoctored: isDoctored,
        time: moment().format("MMMM Do YYYY, h:mm:ss a"),
      });
  } catch (e) {
    return e;
  }
};
export const AddRSA = async (
  uidSender: string,
  uiReceiver: string,
  keyAES: string
) => {
  let friends: FirebaseAuthTypes.User[] = [];
  try {
    return await firebaseApp
      .database()
      .ref("RSA/" + uidSender)
      .set(
        // key AES
        keyAES
      );
  } catch (e) {
    return e;
  }
};
export const UpdateUser = async (uuid: string, time: string) => {
  try {
    return await firebaseApp
      .database()
      .ref("users/" + uuid)
      .update({
        time: time,
      });
  } catch (error) {
    return error;
  }
};
export const UpdateMsg = async (uuid: string, newMsg: boolean) => {
  try {
    return await firebaseApp
      .database()
      .ref("users/" + uuid)
      .update({
        newMsg: newMsg,
      });
  } catch (error) {
    return error;
  }
};
