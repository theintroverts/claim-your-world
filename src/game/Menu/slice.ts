import { createSlice, PayloadAction } from 'redux-starter-kit';

import { AvailableMenu, OpenMenu } from './types';

export const openMenus = createSlice({
    slice: 'openMenus',
    initialState: [{ menu: 'InventoryMenu' }] as Array<OpenMenu<AvailableMenu>>,
    reducers: {
        open: (state, { payload }: PayloadAction<OpenMenu<AvailableMenu>>) => [...state, payload],
        closeTop: state => state.slice(0, -1),
    },
});
