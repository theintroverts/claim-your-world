import Matter, { IPair } from 'matter-js';
import { string } from 'prop-types';
import React, { Component } from 'react';
import { Body, KeyListener, World } from 'react-game-kit';
import { Omit } from 'react-redux';

import { COLLISION_CATEGORY, COLLISION_GROUP, extractTmxCollisionComposite, TileData } from '../util/layer';
import Character from './Character';
import { Debug } from './Debug';
import { createEnergySource, getEnergySourceData } from './energySources';
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
                <Debug {...this.props.tileData} keys={this.props.keyListener} />
                <Character keys={this.props.keyListener} />
            </World>
        );
    }

    public physicsInit = (engine: Matter.Engine) => {
        engine.world.gravity.y = 0;
        const collision = extractTmxCollisionComposite(this.props.tileData.tmxJs);
        Matter.World.addComposite(engine.world, collision);

        createEnergySource(
            { energyAmount: Number.POSITIVE_INFINITY, playerGainDelta: 1, lossDelta: 0 },
            { x: 2500, y: 800, radius: 75, world: engine.world }
        );
        Matter.Events.on(engine, 'collisionActive', (e: any) => {
            for (const pair of (e.pairs || []) as Array<IPair>) {
                console.log(getEnergySourceData(e.bodyA), getEnergySourceData(e.bodyB));
            }
        });
    };
}
