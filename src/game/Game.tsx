import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { KeyListener, Loop, Stage, World } from 'react-game-kit';

import Character from './Character';
import Level from './Level';

export default class Game extends Component {
    static contextTypes = {
        scale: PropTypes.number,
    };

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
                    <World onInit={this.physicsInit}>
                        <Level />
                        <Character keys={this.keyListener} />
                    </World>
                </Stage>
            </Loop>
        );
    }

    getStageStyles(): React.CSSProperties {
        return {
            transform: `scaleX(${this.context.scale}) scaleY(${this.context.scale})`,
            background: '#3a9bdc',
        };
    }

    public physicsInit = (engine: Matter.Engine) => {
        engine.world.gravity.y = 0;

        return;
        const ground = Matter.Bodies.rectangle(512 * 3, 448, 1024 * 3, 64, {
            isStatic: true,
        });

        const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
            isStatic: true,
        });

        const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
            isStatic: true,
        });

        Matter.World.addBody(engine.world, ground);
        Matter.World.addBody(engine.world, leftWall);
        Matter.World.addBody(engine.world, rightWall);
    };

    private keyListener = new KeyListener();
}
