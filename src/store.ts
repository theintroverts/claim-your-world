import { createSlice, configureStore, combineReducers } from 'redux-starter-kit';

export const playerStats = createSlice({
    slice: 'playerStats',
    initialState: {
        energy: 100,
    },
    reducers: {
        setEnergy: (state, { payload: energy }) => ({ energy }),
    },
});

export const store = configureStore({
    reducer: combineReducers({
        playerStats: playerStats.reducer,
    }),
    middleware: [],
    devTools: true,
    enhancers: [],
});
