import PropTypes from 'prop-types';
import * as React from 'react';
import { connect } from 'react-redux';
import { PayloadActionCreator } from 'redux-starter-kit';

import { State } from '../../store';
import { throttleExecution } from '../../util/limitRenders';
import { LockableKeyListener } from '../../util/LockableKeyListener';
import InventoryMenu from './InventoryMenu';
import { openMenus } from './slice';
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
        case 'InventoryMenu':
            return InventoryMenu;
    }
}
class GameMenuHandler extends React.Component<Props> {
    static contextTypes = {
        loop: PropTypes.object,
    };
    private loopSubscription?: number;

    componentDidMount() {
        this.loopSubscription = this.context.loop.subscribe(this.checkKeys);
    }

    componentWillUnmount() {
        this.context.loop.unsubscribe(this.loopSubscription!);
    }

    checkKeys = throttleExecution(() => {
        const { keyListener } = this.props;

        if (keyListener.isDown(keyListener.KEY_I)) this.openInventory();
    }, 20);

    openInventory = throttleExecution(() => this.props.openMenu({ menu: 'InventoryMenu' }), 4);

    render() {
        const { menus, keyListener, closeTopMenu, openMenu } = this.props;
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
    }
}

export default connect(
    (state: State) => ({ menus: state.openMenus }),
    { closeTopMenu: openMenus.actions.closeTop, openMenu: openMenus.actions.open as any }
)(GameMenuHandler);
