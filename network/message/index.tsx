import firebaseApp from "../../firebase/config";

export const senderMsg = async (
  msgValue: string,
  currentUserId: string,
  guestUserId: string,
  img: string,
  time: string
) => {
  try {
    return await firebaseApp
      .database()
      .ref("messages/" + currentUserId)
      .child(guestUserId)
      .push({
        messene: {
          sender: currentUserId,
          receiver: guestUserId,
          msg: msgValue,
          img: img,
          time: time,
        },
      });
  } catch (error) {
    return error;
  }
};

export const receiverMsg = async (
  msgValue: string,
  currentUserId: string,
  guestUserId: string,
  img: string,
  time: string
) => {
  try {
    return await firebaseApp
      .database()
      .ref("messages/" + guestUserId)
      .child(currentUserId)
      .push({
        messene: {
          sender: currentUserId,
          receiver: guestUserId,
          msg: msgValue,
          img: img,
          time: time,
        },
      });
  } catch (error) {
    return error;
  }
};
