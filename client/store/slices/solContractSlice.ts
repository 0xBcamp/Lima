import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { IAccount } from '../../models/account';
import { ISolContract } from '../../models/solContract';

interface SolContractState {
  contracts?: ISolContract[];
  isLoadingContracts: boolean;
}

const initialState: SolContractState = {
  contracts: [],
  isLoadingContracts: true
};

const solContractSlice = createSlice({
  name: 'solContracts',
  initialState,
  reducers: {
    setSolContracts: (state, action) => {
      state.contracts = [...action.payload];
      state.isLoadingContracts = false;
    }
  },
});

export const { setSolContracts } = solContractSlice.actions;
export default solContractSlice.reducer;