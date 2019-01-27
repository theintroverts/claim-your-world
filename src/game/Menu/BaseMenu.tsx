import PropTypes from 'prop-types';
import * as React from 'react';

import { throttleExecution } from '../../util/limitRenders';
import { KeyLock, LockableKeyListener } from '../../util/LockableKeyListener';
import { PixelFont } from '../PixelFont';
import { MenuItem, MenuList, MenuPane } from './';

interface Props {
    rows: Array<Row>;
    keyListener: LockableKeyListener;
    style?: React.CSSProperties;
    className?: string;
}

interface Row {
    text: string;
    onSelect?: () => void;
    isEnabled?: () => boolean;
}

interface State {
    selectedOption: number;
}

export class BaseMenu extends React.Component<Props, State> {
    static contextTypes = {
        loop: PropTypes.object,
    };
    state = { selectedOption: 0 };
    private keyLock?: KeyLock;

    componentDidMount() {
        this.keyLock = this.props.keyListener.acquireLock();
        this.context.loop.subscribe(this.checkKeys);
    }

    componentWillUnmount() {
        if (this.keyLock) {
            this.props.keyListener.releaseLock(this.keyLock);
        }
        this.context.loop.unsubscribe(this.checkKeys);
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
