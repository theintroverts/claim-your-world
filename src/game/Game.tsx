import React, { Component } from 'react';
import { KeyListener, Loop, Stage } from 'react-game-kit';
import { connect } from 'react-redux';

import { State } from '../store';
import { TmxJson, TsxJson } from '../util/layer';
import { LockableKeyListener } from '../util/LockableKeyListener';
import GameStats from './GameStats';
import IntroWorld from './IntroWorld';
import GameMenuHandler from './Menu/GameMenuHandler';
import Scalator from './Scalator';
import Viewport from './Viewport';

const tmxJs: TmxJson = require('../assets/ClaimYourWorld.tmx.json');
const tsxJs: TsxJson = require('../assets/ClaimYourWorld.tsx.json');

export interface Props {
    energy: number;
}

class Game extends Component<Props> {
    componentDidMount() {
        this.keyListener.subscribe([
            this.keyListener.LEFT,
            this.keyListener.RIGHT,
            this.keyListener.UP,
            this.keyListener.DOWN,
            this.keyListener.SPACE,
            this.keyListener.ENTER,
            this.keyListener.KEY_P,
        ]);
    }

    componentWillUnmount() {
        this.keyListener.unsubscribe();
    }

    isAlive = () => this.props.energy > 0;

    render() {
        if (!this.isAlive()) {
            return <div style={{ background: 'red' }}>You lost the game.</div>;
        }

        return (
            <Loop>
                <Stage width={800} height={450} style={this.getStageStyles()}>
                    <Scalator>
                        <Viewport width={800} height={450}>
                            <IntroWorld keyListener={this.keyListener} tileData={{ tmxJs, tsxJs }} />
                        </Viewport>

                        <div style={{ background: "url('beams/BeamHeart_LightBrown_right.png')" }} />
                        <div className="game-stats-wrapper" style={this.getGameStatsWrapperStyles()}>
                            <GameStats />
                        </div>
                        <GameMenuHandler keyListener={this.keyListener} />
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
            fontSize: '16pt',
            left: 547,
            top: 330,
            width: 214,
            height: 80,
        };
    }

    private keyListener = new LockableKeyListener();
}

export default connect(({ playerStats: { energy } }: State) => ({ energy }))(Game);
