import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { KeyListener, World } from 'react-game-kit';

import { extractTmxCollisionComposite, TileData } from '../util/layer';
import Character from './Character';
import Level from './Level';

export interface Prop {
    keyListener: KeyListener;
    tileData: TileData;
}

export default class IntroWorld extends Component<Prop> {
    static contextTypes = {
        loop: PropTypes.object,
        scale: PropTypes.number,
    };

    static childContextTypes = {
        loop: PropTypes.object,
        scale: PropTypes.number,
    };

    getChildContext() {
        return {
            scale: 1,
            loop: this.context.loop,
        };
    }

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
                    <Level tileData={this.props.tileData} />
                    <Character keys={this.props.keyListener} />
                </World>
            </div>
        );
    }

    public physicsInit = (engine: Matter.Engine) => {
        engine.world.gravity.y = 0;
        const collision = extractTmxCollisionComposite(this.props.tileData.tmxJs);
        Matter.World.addComposite(engine.world, collision);
    };
}
