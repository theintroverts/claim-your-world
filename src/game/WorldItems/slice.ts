import { createSlice, PayloadAction, PayloadActionCreator } from 'redux-starter-kit';

import { WorldItem } from './types';

export const worldItems = createSlice({
    slice: 'worldItems',
    initialState: [] as Array<WorldItem>,
    reducers: {
        add: (state, { payload }: PayloadAction<WorldItem>) => [...state, payload],
    },
});
