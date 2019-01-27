import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State } from '../../store';
import { inventory } from '../Inventory/slice';
import { InventoryItem } from '../Inventory/types';
import BaseMenu from './BaseMenu';
import { CommonMenuProps } from './types';

interface Props extends CommonMenuProps {
    items: Array<InventoryItem>;
    playerLocation: State['playerLocation'];
    dispatch: Dispatch;
}
const InventoryMenu = ({ items, playerLocation, dispatch, ...props }: Props) => (
    <BaseMenu
        rows={[
            ...items.map((item, idx) => ({
                text: item.name,
                onSelect: () => {
                    dispatch(inventory.actions.removeItem(idx));
                    dispatch(item.onUse({ playerLocation }));
                },
            })),
            { text: 'cancel', onSelect: props.closeTopMenu },
        ]}
        {...props}
    />
);

export default connect((state: State) => ({
    items: state.inventory,
    playerLocation: state.playerLocation,
}))(InventoryMenu);
