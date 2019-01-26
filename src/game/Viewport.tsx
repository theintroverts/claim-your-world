import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '../store';

export interface Props {
    playerX: number;
    playerY: number;

    width: number;
    height: number;
}

export interface State {
    left: number;
    top: number;
}

class Viewport extends React.Component<Props, State> {
    static contextTypes = {
        loop: PropTypes.object,
        scale: PropTypes.number,
    };

    static childContextTypes = {
        loop: PropTypes.object,
        scale: PropTypes.number,
    };

    static getDerivedStateFromProps(props: Props, state: State): State {
        const displayX = props.playerX - state.left;
        const displayY = props.playerY - state.top;

        let newLeft = state.left;
        let newTop = state.top;

        if (displayX > props.width * 0.67) {
            newLeft = props.playerX - props.width * 0.67;
        }

        if (displayY > props.height * 0.67) {
            newTop = props.playerY - props.height * 0.67;
        }

        if (displayX < props.width * 0.33) {
            newLeft = props.playerX - props.width * 0.33;
        }

        if (displayY < props.height * 0.33) {
            newTop = props.playerY - props.height * 0.33;
        }

        return {
            left: newLeft,
            top: newTop,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            left: 0,
            top: 0,
        };
    }

    resizeHandler = () => {
        this.setState(state => Viewport.getDerivedStateFromProps(this.props, state));
    };

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }

    getChildContext() {
        return {
            scale: 1,
            loop: this.context.loop,
        };
    }

    getStyles(): React.CSSProperties {
        return {
            transform: `scaleX(${this.context.scale}) scaleY(${this.context.scale}) translate(${-this.state
                .left}px, ${-this.state.top}px) `,
            transformOrigin: 'top left',
        };
    }

    render() {
        return <div style={this.getStyles()}>{this.props.children}</div>;
    }
}

export default connect(({ playerLocation: { x, y } }: StoreState) => ({ playerX: x, playerY: y }))(Viewport);
