import { Omit } from 'react-redux';
import { combineReducers, configureStore, createSlice, PayloadAction } from 'redux-starter-kit';
import { EnhancedStore } from 'redux-starter-kit/src/configureStore';

import { EnergySourceData } from './game/energySources';
import { energySources } from './game/EnergySources/slice';
import { inventory } from './game/Inventory/slice';
import { InventoryItem } from './game/Inventory/types';
import { openMenus } from './game/Menu/slice';
import { AvailableMenu, MenuMeta, OpenMenu } from './game/Menu/types';
import { worldItems } from './game/WorldItems/slice';

export const playerStats = createSlice({
    slice: 'playerStats',
    initialState: {
        energy: 100,
        money: 30,
        food: 42,
    },
    reducers: {
        modifyEnergy: (state, { payload: energy }: PayloadAction<number>) => ({
            ...state,
            energy: Math.min(100, state.energy + energy),
        }),
        modifyMoney: (state, { payload: money }: PayloadAction<number>) => ({
            ...state,
            money: Math.max(0, state.money + money),
        }),
        modifyFood: (state, { payload: food }: PayloadAction<number>) => ({
            ...state,
            food: Math.max(0, state.food + food),
        }),
    },
});

export const playerLocation = createSlice({
    slice: 'playerLocation',
    initialState: {
        x: 2500,
        y: 750,
    },
    reducers: {
        setCharacterPosition: (state, { payload: { x, y } }: PayloadAction<{ x: number; y: number }>) => ({ x, y }),
    },
});

export const store = configureStore({
    reducer: combineReducers({
        playerStats: playerStats.reducer,
        playerLocation: playerLocation.reducer,
        energySources: energySources.reducer,
        openMenus: openMenus.reducer,
        inventory: inventory.reducer,
        worldItems: worldItems.reducer,
    }),
    middleware: [],
    devTools: true,
    enhancers: [],
});

export type State = typeof store extends EnhancedStore<infer State> ? State : never;
