import { createSlice } from '@reduxjs/toolkit';

interface BloackchainState {
  blockNumber?: number
  blockTimestamp?: number
}

const initialState: BloackchainState = {
  blockNumber: undefined,
  blockTimestamp: undefined
};

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setBlocknumber: (state, action) => {
      state.blockNumber = action.payload;
    },
    setBlock: (state, action) => {
      const {blockNumber, blockTimestamp} = action.payload
      state.blockNumber = blockNumber;
      state.blockTimestamp = blockTimestamp;
    }
  },
});

export const { setBlocknumber, setBlock } = blockchainSlice.actions;
export default blockchainSlice.reducer;