import { PagesEnum } from '@/enums/PagesEnum';
import { createSlice } from '@reduxjs/toolkit';
import { IProperty } from '../../models/property';

interface NavigationState {
  page: string;
  selectedProperty?: IProperty;
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
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    }
  },
});

export const { setPage, setSelectedProperty } = navigationSlice.actions;
export default navigationSlice.reducer;