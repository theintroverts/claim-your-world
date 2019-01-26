import React, { Component } from 'react';
import { KeyListener, Loop, Stage } from 'react-game-kit';

import { TmxJson, TsxJson } from '../util/layer';
import IntroWorld from './IntroWorld';
import Viewport from './Viewport';

const tmxJs: TmxJson = require('../assets/ClaimYourWorld.tmx.json');
const tsxJs: TsxJson = require('../assets/ClaimYourWorld.tsx.json');

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
                <Stage width={1800} height={600} style={this.getStageStyles()}>
                    <Viewport width={1800} height={600}>
                        <IntroWorld keyListener={this.keyListener} tileData={{ tmxJs, tsxJs }} />
                    </Viewport>
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
