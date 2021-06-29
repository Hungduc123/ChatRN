// useEffect(() => {
//     const doSendRSA = async () => {
//       const getUkRSA = async () => {
//         let tempUkReceiver: any = {};
//         try {
//           await firebaseApp
//             .database()
//             .ref("publicKey/" + itemChoose.uid)
//             .on("value", (dataSnapshot: any) => {
//               console.log("dataSnapshot.val");
//               console.log(dataSnapshot.val());
//               tempUkReceiver = { ...dataSnapshot.val() };
//               console.log("ukReceiver");
//               console.log(tempUkReceiver);
//             });
//         } catch (error) {
//           console.log(error);
//         }
//         return tempUkReceiver;
//       };

//       const enCodeRSAWithKeyAES = async (tempUkReceiver: any) => {
//         rsa.setPublicString(JSON.stringify({ ...tempUkReceiver }));
//         var encryptedKey = rsa.encrypt(JSON.stringify(key));
//         var encryptedIv = rsa.encrypt(JSON.stringify(iv));

//         console.log("====================================");
//         console.log("encryptedKey   " + encryptedKey);
//         console.log("====================================");
//         console.log("====================================");
//         console.log("encryptedIv    " + encryptedIv);
//         console.log("====================================");

//         return { encryptedKey, encryptedIv };
//       };
//       const sendRSAWithKeyAES = async (encrypted: any, receiver: any) => {
//         try {
//           ///////////////////////////////////chua sen dc rsa ,
//           await firebaseApp
//             .database()
//             .ref("RSA/" + currentUser.uid)
//             .child(receiver.uid)
//             .set({
//               messageRSA: {
//                 sender: currentUser.uid,
//                 receiver: receiver.uid,
//                 encryptedKey: encrypted.encryptedKey,
//                 encryptedIv: encrypted.encryptedIv,
//               },
//             });
//           await firebaseApp
//             .database()
//             .ref("RSA/" + receiver.uid)
//             .child(currentUser.uid)
//             .set({
//               messageRSA: {
//                 sender: currentUser.uid,
//                 receiver: receiver.uid,
//                 encryptedKey: encrypted.encryptedKey,
//                 encryptedIv: encrypted.encryptedIv,
//               },
//             });
//         } catch (error) {
//           console.error(error);
//         }
//       };

//       ///////////
//       await getUkRSA().then((tempUkReceiver) => {
//         enCodeRSAWithKeyAES(tempUkReceiver).then((encrypted) => {
//           sendRSAWithKeyAES(encrypted, itemChoose).then(() => {
//             getKeyAESFromRSA().then((tempKeyAESEncodeByRSA) => {
//               if (currentUser.uid === tempKeyAESEncodeByRSA.sender) {
//                 decodeRSA(tempKeyAESEncodeByRSA); //////////////////////////////////////////////////////////////
//               }
//             });
//           });
//         });
//       });
//     };
//     /////////////////////
//     const getKeyAESFromRSA = async () => {
//       let tempKeyAESEncodeByRSA: any;
//       try {
//         await firebaseApp
//           .database()
//           .ref("RSA/" + currentUser.uid)
//           .child(itemChoose.uid)
//           .on("value", (dataSnapshot: any) => {
//             tempKeyAESEncodeByRSA = { ...dataSnapshot.val().messageRSA };
//             console.log("tempKeyAESEncodeByRSA");
//             console.log(tempKeyAESEncodeByRSA);
//           });
//       } catch (error) {
//         console.log(error);
//       }
//       return tempKeyAESEncodeByRSA;
//     };
//     const decodeRSA = (encrypted: any) => {
//       rsa.setPrivateString(pkReceiver);
//       let encryptedIv = rsa.decrypt(encrypted.encryptedIv);
//       let encryptedKey = rsa.decrypt(encrypted.encryptedKey);
//       console.log("====================================");
//       console.log("encryptedIv");
//       console.log(encryptedIv);

//       console.log("====================================");
//       console.log("====================================");
//       console.log("encryptedIv");
//       console.log(encryptedKey);

//       console.log("====================================");
//     };

//     doSendRSA();
//   }, []);
