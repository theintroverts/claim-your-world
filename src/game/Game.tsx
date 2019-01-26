import React, { Component } from 'react';
import { KeyListener, Loop, Stage } from 'react-game-kit';

import { TmxJson, TsxJson } from '../util/layer';
import GameStats from './GameStats';
import IntroWorld from './IntroWorld';
import Scalator from './Scalator';
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
            80,
        ]);
    }

    componentWillUnmount() {
        this.keyListener.unsubscribe();
    }

    render() {
        return (
            <Loop>
                <Stage width={800} height={450} style={this.getStageStyles()}>
                    <Scalator>
                        <Viewport width={800} height={450}>
                            <IntroWorld keyListener={this.keyListener} tileData={{ tmxJs, tsxJs }} />
                        </Viewport>

                        <div style={this.getGameStatsWrapperStyles()}>
                            <GameStats />
                        </div>
                    </Scalator>
                </Stage>
            </Loop>
        );
    }

    getStageStyles(): React.CSSProperties {
        return {
            background: '#3a9bdc',
        };
    }

    getGameStatsWrapperStyles(): React.CSSProperties {
        return {
            position: 'absolute',
            background: 'pink',
            left: 586,
            top: 350,
            width: 194,
            height: 80,
        };
    }

    private keyListener = new KeyListener();
}
