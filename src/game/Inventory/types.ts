import { Action } from 'redux';

import { State } from '../../store';

export interface InventoryItem {
    name: string;
    onUse: (data: Pick<State, 'playerLocation'>) => Action;
}
