import Matter, { IPair } from 'matter-js';
import React, { Component } from 'react';
import { KeyListener, World } from 'react-game-kit';
import { connect } from 'react-redux';

import { playerStats } from '../store';
import { extractTmxCollisionComposite, TileData } from '../util/layer';
import Character from './Character';
import { Debug } from './Debug';
import { createEnergySource, getEnergySourceData } from './energySources';
import Level from './Level';

export interface Prop {
    keyListener: KeyListener;
    tileData: TileData;

    modifyEnergy: (energy: number) => void;
}

class IntroWorld extends Component<Prop> {
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
            { radius: 75, energyAmount: Number.POSITIVE_INFINITY, playerGainDelta: 0.01, lossDelta: 0 },
            { x: 2500, y: 800, world: engine.world }
        );

        Matter.Events.on(engine, 'collisionActive', (e: any) => {
            let scoreModification = 0;
            for (const pair of (e.pairs || []) as Array<IPair>) {
                const energySourceData = getEnergySourceData(pair.bodyA) || getEnergySourceData(pair.bodyB);
                if (energySourceData === undefined) {
                    continue;
                }

                const distance = Math.sqrt(
                    (pair.bodyA.position.x - pair.bodyB.position.x) ** 2 +
                        (pair.bodyA.position.y - pair.bodyB.position.y) ** 2
                );

                const factor = Math.max(0, energySourceData.radius - distance) / distance;
                scoreModification += energySourceData.playerGainDelta * factor;
            }

            if (scoreModification !== 0) {
                this.props.modifyEnergy(scoreModification);
            }
        });
    };
}

export default connect(
    undefined,
    {
        modifyEnergy: playerStats.actions.modifyEnergy,
    }
)(IntroWorld);
