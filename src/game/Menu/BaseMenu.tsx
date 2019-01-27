import PropTypes from 'prop-types';
import * as React from 'react';

import styled from '@emotion/styled-base';

import { throttleExecution } from '../../util/limitRenders';
import { KeyLock } from '../../util/LockableKeyListener';
import { PixelFont } from '../PixelFont';
import { MenuItem, MenuList, MenuPane } from './';
import { CommonMenuProps } from './types';

interface Props extends CommonMenuProps {
    rows: Array<Row>;
}

interface Row {
    text: string;
    onSelect?: () => void;
    isEnabled?: () => boolean;
}

interface State {
    selectedOption: number;
}

class BaseMenu extends React.Component<Props, State> {
    static contextTypes = {
        loop: PropTypes.object,
    };
    state = { selectedOption: 0 };
    private keyLock?: KeyLock;
    private loopSubscription?: number;

    componentDidMount() {
        this.keyLock = this.props.keyListener.acquireLock();
        this.loopSubscription = this.context.loop.subscribe(this.checkKeys);
    }

    componentWillUnmount() {
        this.context.loop.unsubscribe(this.loopSubscription!);
        this.props.keyListener.releaseLock(this.keyLock!);
    }

    checkKeys = throttleExecution(() => {
        const { keyListener } = this.props;

        if (keyListener.isDown(keyListener.DOWN, this.keyLock)) this.changeSelectedOption(1);
        if (keyListener.isDown(keyListener.UP, this.keyLock)) this.changeSelectedOption(-1);
        if (keyListener.isDown(keyListener.SPACE, this.keyLock)) this.selectMenuOption();
        if (keyListener.isDown(keyListener.ENTER, this.keyLock)) this.selectMenuOption();
    }, 20);

    changeSelectedOption = throttleExecution(
        (movement: number) => this.setState(state => ({ ...state, selectedOption: state.selectedOption + movement })),
        4
    );

    selectMenuOption = throttleExecution(() => {
        const onSelect = this.props.rows.length > 0 && this.props.rows[this.selectedOption].onSelect;
        if (onSelect) {
            onSelect();
        }
    }, 1);

    get selectedOption() {
        return (this.state.selectedOption + this.props.rows.length) % this.props.rows.length;
    }

    render() {
        const { style, className, rows } = this.props;
        const { selectedOption } = this;
        return (
            <MenuPane style={style} className={className}>
                <MenuList>
                    {rows.map((row, idx) => (
                        <MenuItem key={idx} onClick={row.onSelect} selected={selectedOption === idx}>
                            <PixelFont text={row.text} style={{ display: 'block' }} />
                        </MenuItem>
                    ))}
                </MenuList>
            </MenuPane>
        );
    }
}

export default styled(BaseMenu)`
    position: absolute;
    left: 400px;
    top: 225px;
    transform: translate(-50%, -50%);
`;
