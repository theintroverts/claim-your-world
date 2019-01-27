import { Action } from 'redux';

export interface InventoryItem {
    name: string;
    onUse: () => Action;
}
