import { Omit } from 'react-redux';
import { combineReducers, configureStore, createSlice, PayloadAction } from 'redux-starter-kit';
import { EnhancedStore } from 'redux-starter-kit/src/configureStore';
import UUID from 'uuid';

import { EnergySourceData } from './game/energySources';
import { AvailableMenu, MenuMeta, OpenMenu } from './game/Menu/types';

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

export const openMenus = createSlice({
    slice: 'openMenus',
    initialState: [{ menu: 'TestMenu' }] as Array<OpenMenu<AvailableMenu>>,
    reducers: {
        open: (state, { payload }: PayloadAction<OpenMenu<AvailableMenu>>) => [...state, payload],
        closeTop: state => state.slice(0, -1),
    },
});

type AllowedPartialBlar = 'id' | 'playerGainEnergyDelta' | 'playerGainMoneyDelta' | 'playerGainFoodDelta';
export type EnergySourceCreationData = Omit<EnergySourceData, 'createdAt' | AllowedPartialBlar> &
    Partial<Pick<EnergySourceData, AllowedPartialBlar>>;

export const energySources = createSlice({
    slice: 'energySources',
    initialState: [] as Array<EnergySourceData>,
    reducers: {
        addEnergySource: (state, { payload: { id, ...data } }: PayloadAction<EnergySourceCreationData>) => [
            ...state,
            {
                id: id || UUID.v4(),
                playerGainEnergyDelta: () => 0,
                playerGainMoneyDelta: () => 0,
                playerGainFoodDelta: () => 0,
                ...data,
                createdAt: new Date(),
            },
        ],
    },
});

export const store = configureStore({
    reducer: combineReducers({
        playerStats: playerStats.reducer,
        playerLocation: playerLocation.reducer,
        energySources: energySources.reducer,
        openMenus: openMenus.reducer,
    }),
    middleware: [],
    devTools: true,
    enhancers: [],
});

export type State = typeof store extends EnhancedStore<infer State> ? State : never;
