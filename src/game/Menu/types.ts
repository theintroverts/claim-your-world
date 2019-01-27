import * as React from 'react';
import { PayloadActionCreator } from 'redux-starter-kit';

import { LockableKeyListener } from '../../util/LockableKeyListener';

export type AvailableMenu = 'TestMenu' | 'InventoryMenu';
export type MenuMeta<T extends AvailableMenu> = never;

export type MenuComponentType<T extends AvailableMenu> = React.ComponentType<
    CommonMenuProps & (MenuMeta<T> extends never ? { args?: never } : { args: MenuMeta<T> })
>;

export type OpenMenu<T extends AvailableMenu> = MenuMeta<T> extends never
    ? { menu: T; args?: never }
    : {
          menu: T;
          args: MenuMeta<T>;
      };

export interface CommonMenuProps {
    keyListener: LockableKeyListener;
    style?: React.CSSProperties;
    className?: string;
    closeTopMenu: () => void;
    openMenu: PayloadActionCreator<OpenMenu<AvailableMenu>>;
}
