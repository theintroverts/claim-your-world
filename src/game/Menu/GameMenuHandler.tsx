import * as React from 'react';
import { connect } from 'react-redux';
import { PayloadActionCreator } from 'redux-starter-kit';

import { openMenus, State } from '../../store';
import { LockableKeyListener } from '../../util/LockableKeyListener';
import TestMenu from './TestMenu';
import { AvailableMenu, CommonMenuProps, MenuComponentType, MenuMeta, OpenMenu } from './types';

interface Props {
    menus: Array<OpenMenu<AvailableMenu>>;
    keyListener: LockableKeyListener;
    closeTopMenu: () => void;
    openMenu: PayloadActionCreator<OpenMenu<AvailableMenu>>;
}

function getMenuComponent<T extends AvailableMenu>(menuName: T): MenuComponentType<T> {
    switch (menuName as AvailableMenu) {
        case 'TestMenu':
            return TestMenu;
    }
}
const GameMenuHandler = ({ menus, keyListener, closeTopMenu, openMenu }: Props) => {
    const commonProps: CommonMenuProps = {
        keyListener,
        closeTopMenu,
        openMenu,
    };

    return (
        <>
            {menus.map(({ menu, args }: { menu: AvailableMenu; args?: MenuMeta<any> }, idx) => {
                const Component = getMenuComponent(menu);
                return <Component key={idx} {...commonProps} args={args} />;
            })}
        </>
    );
};

export default connect(
    (state: State) => ({ menus: state.openMenus }),
    { closeTopMenu: openMenus.actions.closeTop, openMenu: openMenus.actions.open as any }
)(GameMenuHandler);
