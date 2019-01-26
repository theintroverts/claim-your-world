import { Omit } from 'react-redux';
import { combineReducers, configureStore, createSlice, PayloadAction } from 'redux-starter-kit';
import { EnhancedStore } from 'redux-starter-kit/src/configureStore';

import { EnergySourceData } from './game/energySources';

export const playerStats = createSlice({
    slice: 'playerStats',
    initialState: {
		energy: 100,
		money: 30,
    },
    reducers: {
        modifyEnergy: (state, { payload: energy }) => ({...state, energy: Math.min(100, state.energy + energy) }),
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

export type EnergySourceCreationData = Omit<EnergySourceData, 'createdAt' | 'key'>;

export const energySources = createSlice({
    slice: 'energySources',
    initialState: [] as Array<EnergySourceData>,
    reducers: {
        addEnergySource: (state, { payload: energySource }: PayloadAction<EnergySourceCreationData>) => [
            ...state,
            { ...energySource, key: Math.random().toString(), createdAt: new Date() },
        ],
    },
});

export const store = configureStore({
    reducer: combineReducers({
        playerStats: playerStats.reducer,
        playerLocation: playerLocation.reducer,
        energySources: energySources.reducer,
    }),
    middleware: [],
    devTools: true,
    enhancers: [],
});

export type State = typeof store extends EnhancedStore<infer State> ? State : never;
