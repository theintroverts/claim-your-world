import { Omit } from 'react-redux';
import { combineReducers, configureStore, createSlice, PayloadAction } from 'redux-starter-kit';
import { EnhancedStore } from 'redux-starter-kit/src/configureStore';

import { EnergySourceData } from './game/energySources';

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

type AllowedPartialBlar = 'playerGainEnergyDelta' | 'playerGainMoneyDelta' | 'playerGainFoodDelta';
export type EnergySourceCreationData = Omit<EnergySourceData, 'createdAt' | 'key' | AllowedPartialBlar> &
    Partial<Pick<EnergySourceData, AllowedPartialBlar>>;

export const energySources = createSlice({
    slice: 'energySources',
    initialState: [] as Array<EnergySourceData>,
    reducers: {
        addEnergySource: (state, { payload: energySource }: PayloadAction<EnergySourceCreationData>) => [
            ...state,
            {
                playerGainEnergyDelta: () => 0,
                playerGainMoneyDelta: () => 0,
                playerGainFoodDelta: () => 0,
                ...energySource,
                key: Math.random().toString(),
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
    }),
    middleware: [],
    devTools: true,
    enhancers: [],
});

export type State = typeof store extends EnhancedStore<infer State> ? State : never;
