import { createSlice } from "@reduxjs/toolkit";
import dataUser from "../data/dataUser";

// var data:dataItem
const data: any = {};
const slice = createSlice({
  name: "DatainVietNam",
  initialState: data,

  reducers: {
    DataInVietNam: (state, action) => {
      state = {
        ...action.payload,
      };
      return state;
    },
  },
});
const { reducer, actions } = slice;
export const { DataInVietNam } = actions;
export default reducer;
