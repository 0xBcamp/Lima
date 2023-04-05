import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import accountReducer from './slices/accountSlice';
import blockchainReducer from './slices/blockchainSlice';
import solContractReducer from './slices/solContractSlice';
import sidePanelReducer from './slices/sidePanelSlice';
import navigationReducer from './slices/navigationSlice';

const store = configureStore({
	reducer: {
		account: accountReducer,
		blockchain: blockchainReducer,
		sidePanel: sidePanelReducer,
		solContract: solContractReducer,
		user: userReducer,
		navigation: navigationReducer
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;