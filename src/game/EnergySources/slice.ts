import { createSlice, PayloadAction } from 'redux-starter-kit';
import UUID from 'uuid';

import { Omit } from '@emotion/styled-base/types/helper';

import { EnergySourceData } from '../energySources';

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
