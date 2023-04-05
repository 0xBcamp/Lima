import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAccount } from '../../models/account';
import { WritableDraft } from 'immer/dist/internal';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { ISolContract } from '../../models/solContract';

interface SidePanelState {
    panels: Array<{
        isOpen: boolean;
        title: string;
        contentComponent: string;
        sourceId: string;
        selectedAccount?: IAccount;
        selectedContract?: ISolContract;
    }>;
}

interface OpenSidePanelPayload {
    title: string;
    contentComponent: string;
    sourceId: string;
}

interface CloseSidePanelPayload {
    contentComponent: string;
}

const initialState: SidePanelState = {
    panels: [],
};

const sidePanelSlice = createSlice({
    name: 'sidePanel',
    initialState,
    reducers: {
        openSidePanel: (state, action: PayloadAction<OpenSidePanelPayload>) => {
            if (!state.panels.some(x => x.contentComponent === action.payload.contentComponent)) {
                state.panels.push({
                    isOpen: true,
                    title: action.payload.title,
                    contentComponent: action.payload.contentComponent,
                    sourceId: action.payload.sourceId
                });
            }
        },
        closeSidePanel: (state, action: PayloadAction<CloseSidePanelPayload>) => {
            const panelIndex = state.panels.findIndex((panel) => panel.contentComponent === action.payload.contentComponent);
            if (panelIndex !== -1) {
                state.panels.splice(panelIndex, 1);
            }
        },
        setSidePanelSelectedAccount: (state, action) => {
            const panelIndex = state.panels.findIndex((panel) => panel.contentComponent === PanelsEnum.AccountsPanel);
            if (panelIndex !== -1) {
                state.panels[panelIndex] = { ...state.panels[panelIndex], selectedContract: action.payload.selectedAccount };
            }
        },
        setSidePanelSelectedContract: (state, action) => {
            const panelIndex = state.panels.findIndex((panel) => panel.contentComponent === PanelsEnum.ContractsPanel);
            if (panelIndex !== -1) {
                state.panels[panelIndex] = { ...state.panels[panelIndex], selectedContract: action.payload };
            }
        },
    },
});

export const { openSidePanel, closeSidePanel, setSidePanelSelectedAccount, setSidePanelSelectedContract } = sidePanelSlice.actions;
export default sidePanelSlice.reducer;