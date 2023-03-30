import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import accountReducer from './slices/accountSlice';
import blockchainReducer from './slices/blockchainSlice';
import solContractReducer from './slices/solContractSlice';

const store = configureStore({
	reducer: {
		account: accountReducer,
		blockchain: blockchainReducer,
		solContract: solContractReducer,
		user: userReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;