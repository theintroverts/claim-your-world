import { combineReducers, configureStore, createSlice, PayloadAction } from 'redux-starter-kit';
import { EnhancedStore } from 'redux-starter-kit/src/configureStore';

export const playerStats = createSlice({
    slice: 'playerStats',
    initialState: {
        energy: 100,
    },
    reducers: {
        setEnergy: (state, { payload: energy }) => ({ energy }),
    },
});

export const playerLocation = createSlice({
    slice: 'playerLocation',
    initialState: {
        x: 50,
        y: 50,
    },
    reducers: {
        setCharacterPosition: (state, { payload: { x, y } }: PayloadAction<{ x: number; y: number }>) => ({ x, y }),
    },
});

export const store = configureStore({
    reducer: combineReducers({
        playerStats: playerStats.reducer,
        playerLocation: playerLocation.reducer,
    }),
    middleware: [],
    devTools: true,
    enhancers: [],
});

export type State = typeof store extends EnhancedStore<infer State> ? State : never;
