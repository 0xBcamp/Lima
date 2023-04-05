import { PagesEnum } from '@/enums/PagesEnum';
import { createSlice } from '@reduxjs/toolkit';

interface NavigationState {
  page: string;
}

const initialState: NavigationState = {
  page: PagesEnum.Overview,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    }
  },
});

export const { setPage } = navigationSlice.actions;
export default navigationSlice.reducer;