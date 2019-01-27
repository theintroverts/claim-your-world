import { createSlice, PayloadAction } from 'redux-starter-kit';

import { worldItems } from '../WorldItems/slice';
import { WorldItem } from '../WorldItems/types';
import YoshiEgg from '../WorldItems/YoshiEgg';
import { InventoryItem } from './types';

const yoshiEgg: InventoryItem = {
    name: 'Yoshi Egg',
    onUse: ({ playerLocation }) =>
        worldItems.actions.add({
            Component: YoshiEgg,
            props: { x: playerLocation.x + 30, y: playerLocation.y },
        }),
};

export const inventory = createSlice({
    slice: 'inventory',
    initialState: [yoshiEgg] as Array<InventoryItem>,
    reducers: {
        addItem: (state, { payload: item }: PayloadAction<InventoryItem>) => [...state, item],
        removeItem: (state, { payload: index }: PayloadAction<number>) =>
            state.slice(0, index - 1).concat(state.slice(index + 1)),
    },
});
