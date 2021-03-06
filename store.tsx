import { configureStore } from "@reduxjs/toolkit";
import chooseItemReducer from "./slice/chooseItem";
import CurrentUserReducer from "./slice/CurrentUser";
import PrivateKeyReducer from "./slice/PrivateKey";
import PublicKeyReducer from "./slice/PublicKey";
import KeyAESReducer from "./slice/KeyAES";
import AccountDoctorLoginReducer from "./slice/accountDoctor";
import DataInVietNamReducer from "./slice/DataInVietNam";
import UserStoreReducer from "./slice/UserStore";
const rootReducer = {
  chooseItem: chooseItemReducer,
  CurrentUser: CurrentUserReducer,
  PrivateKey: PrivateKeyReducer,
  PublicKey: PublicKeyReducer,
  KeyAES: KeyAESReducer,
  AccountDoctorLogin: AccountDoctorLoginReducer,
  DataInVietNam: DataInVietNamReducer,
  UserStore: UserStoreReducer,
};
const store = configureStore({
  reducer: rootReducer,
});
export default store;
