import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { address } = action.payload;
      state.address = address;
    },
    clearUser: (state) => {
      state.address = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;