import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { KeyListener, World } from 'react-game-kit';

import Character from './Character';
import Level from './Level';

export interface Prop {
    keyListener: KeyListener;
}

export default class IntroWorld extends Component<Prop> {
    static contextTypes = {
        scale: PropTypes.number,
    };

    getStyles(): React.CSSProperties {
        return {
            transform: `scaleX(${this.context.scale}) scaleY(${this.context.scale})`,
            transformOrigin: 'top left',
        };
    }

    render() {
        return (
            <div style={this.getStyles()}>
                <World onInit={this.physicsInit}>
                    <Level />
                    <Character keys={this.props.keyListener} />
                </World>
            </div>
        );
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
}
