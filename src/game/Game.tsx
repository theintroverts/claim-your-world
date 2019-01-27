import React, { Component } from 'react';
import { AudioPlayer, KeyListener, Loop, Stage } from 'react-game-kit';
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

function makeDistortionCurve(amount: number | undefined) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for (; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

export interface Props {
    energy: number;
}

class Game extends Component<Props> {
    private player: AudioPlayer | undefined;
    private distortion: any;
    private distortionLevel: any = null;
    private stopMusic: undefined | (() => void);

    public UNSAFE_componentWillReceiveProps(newProps: Props) {
        if (newProps.energy <= 0) {
            this.stopMusic && this.stopMusic();
        } else if (newProps.energy < 15) {
            if (this.distortionLevel !== 15) {
                this.distortion.curve = makeDistortionCurve(60);
                this.distortionLevel = 15;
                console.log('moar destortion');
            }
        } else if (newProps.energy < 25) {
            if (this.distortionLevel !== 25) {
                this.distortion.curve = makeDistortionCurve(35);
                this.distortionLevel = 25;
                console.log('some distortion');
            }
        } else if (this.distortionLevel !== null) {
            this.distortion.curve = null;
            this.distortionLevel = null;
        }
    }

    componentDidMount() {
        this.player = new AudioPlayer('music/Depressed of Happytown.mp3', () => {
            if (this.player === undefined) {
                throw new Error('not reached');
            }

            const analyser = this.player.context.createAnalyser();
            this.distortion = this.player.context.createWaveShaper();
            const source = this.player.context.createBufferSource();

            const gainNode = this.player.context.createGain();
            gainNode.gain.value = 0.8;

            source.connect(analyser);
            analyser.connect(this.distortion);
            this.distortion.connect(gainNode);
            gainNode.connect(this.player.context.destination);

            source.buffer = this.player.buffer;
            source.start(0);
            source.loop = true;
            this.stopMusic = source.stop.bind(source);
        });

        this.keyListener.subscribe([
            this.keyListener.LEFT,
            this.keyListener.RIGHT,
            this.keyListener.UP,
            this.keyListener.DOWN,
            this.keyListener.SPACE,
            this.keyListener.ENTER,
            this.keyListener.KEY_I,
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
