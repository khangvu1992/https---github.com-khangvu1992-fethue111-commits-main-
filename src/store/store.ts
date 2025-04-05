// src/store/store.ts
"use client";
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataslice';  // Import reducer từ slice

const store = configureStore({
  reducer: {
    data: dataReducer,  // Kết nối slice vào store
  },
});

export default store;
