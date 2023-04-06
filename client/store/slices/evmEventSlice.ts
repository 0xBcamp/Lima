import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEvmEvent } from '../../models/evmEvents';

interface EventState {
    lastEventAdded: string;
    evmEvents: IEvmEvent[];
}

const initialState: EventState = {
    lastEventAdded: "",
    evmEvents: [],
};

export const evmEventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.evmEvents.unshift(action.payload);
            state.lastEventAdded = new Date().toString();
        },
        addEvents: (state, action) => {
            state.evmEvents = [...action.payload];
        },
    },
});

export const { addEvent, addEvents } = evmEventSlice.actions;

export default evmEventSlice.reducer;