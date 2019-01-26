import React, { Component } from 'react';
import { KeyListener, Loop, Stage } from 'react-game-kit';

import IntroWorld from './IntroWorld';

export default class Game extends Component {
    componentDidMount() {
        this.keyListener.subscribe([
            this.keyListener.LEFT,
            this.keyListener.RIGHT,
            this.keyListener.UP,
            this.keyListener.DOWN,
        ]);
    }

    componentWillUnmount() {
        this.keyListener.unsubscribe();
    }

    render() {
        return (
            <Loop>
                <Stage style={this.getStageStyles()}>
                    <IntroWorld keyListener={this.keyListener} />
                </Stage>
            </Loop>
        );
    }

    getStageStyles(): React.CSSProperties {
        return {
            background: '#3a9bdc',
        };
    }

    private keyListener = new KeyListener();
}
