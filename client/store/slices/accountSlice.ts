import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { IAccount } from '../../models/account';

interface AccountState {
  provider?: ethers.JsonRpcProvider;
  accounts: IAccount[];
  selectedAccount?: IAccount;
}

const initialState: AccountState = {
  provider: undefined,
  accounts: [],
  selectedAccount: undefined
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
  },
});

export const { setProvider, setAccounts, setSelectedAccount } = accountsSlice.actions;
export default accountsSlice.reducer;