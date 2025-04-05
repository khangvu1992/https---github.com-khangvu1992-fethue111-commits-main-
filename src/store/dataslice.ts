// src/store/dataSlice.ts
"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu cho state
interface DataState {
  dataFromChild: undefined;
}

// State mặc định
const initialState: DataState = {
  dataFromChild: undefined,
};

// Tạo slice bằng Redux Toolkit
const dataSlice = createSlice({
  name: 'data',  // Tên slice
  initialState,
  reducers: {
    // Reducer để cập nhật dữ liệu
    setDataFromChild: (state, action: PayloadAction<any>) => {
      state.dataFromChild = action.payload;
    },
  },
});

// Export action để sử dụng ở component
export const { setDataFromChild } = dataSlice.actions;

// Export reducer để sử dụng trong store
export default dataSlice.reducer;
