import Matter from 'matter-js';
import React, { Component } from 'react';
import { KeyListener, World } from 'react-game-kit';

import { extractTmxCollisionComposite, TileData } from '../util/layer';
import Character from './Character';
import { Debug } from './Debug';
import Level from './Level';

export interface Prop {
    keyListener: KeyListener;
    tileData: TileData;
}

export default class IntroWorld extends Component<Prop> {
    render() {
        return (
            <World onInit={this.physicsInit}>
                <Level tileData={this.props.tileData} />
                <Character keys={this.props.keyListener} />
                <Debug {...this.props.tileData} keys={this.props.keyListener} />
            </World>
        );
    }

    public physicsInit = (engine: Matter.Engine) => {
        engine.world.gravity.y = 0;
        const collision = extractTmxCollisionComposite(this.props.tileData.tmxJs);
        Matter.World.addComposite(engine.world, collision);
    };
}
