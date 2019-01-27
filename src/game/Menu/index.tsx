import * as React from 'react';

import styled from '@emotion/styled';

export const MenuPane = styled.div({
    border: 'solid red 1px',
    width: '200px',
    background: 'rgba(255,255,255,0.5)',
    transform: 'scale(1.4)',
    padding: '8px',
});

export const MenuList = styled.div({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    alignItems: 'stretch',
    alignContent: 'center',
});

interface MenuItemProps {
    selected: boolean;
}
export const MenuItem = styled.div<MenuItemProps>`
    height: 16px;
    background: ${props => (props.selected ? 'rgba(0,0,0,0.5)' : 'none')};
`;
