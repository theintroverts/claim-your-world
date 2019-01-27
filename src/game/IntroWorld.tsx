import Matter, { IPair } from 'matter-js';
import React, { Component } from 'react';
import { KeyListener, World } from 'react-game-kit';
import { connect } from 'react-redux';

import { EnergySourceCreationData, energySources, playerStats, State, store } from '../store';
import { extractTmxCollisionComposite, TileData } from '../util/layer';
import Character from './Character';
import { Debug } from './Debug';
import EnergySource from './EnergySource';
import { EnergySourceData, getEnergySourceData } from './energySources';
import Level from './Level';
import YoshiEgg from './YoshiEgg';

export interface Prop {
    keyListener: KeyListener;
    tileData: TileData;
    energySources: Array<EnergySourceData>;

    playerStats: State['playerStats'];

    modifyEnergy: (energy: number) => void;
    modifyMoney: (money: number) => void;
    modifyFood: (food: number) => void;

    addEnergySource: (x: EnergySourceCreationData) => void;
}

class IntroWorld extends Component<Prop> {
    render() {
        return (
            <World onInit={this.physicsInit}>
                <Level tileData={this.props.tileData} />
                <Debug {...this.props.tileData} keys={this.props.keyListener} />
                <YoshiEgg x={350} y={350} />
                {this.props.energySources.map(x => (
                    <EnergySource {...x} />
                ))}
                <Character keys={this.props.keyListener} />
            </World>
        );
    }

    public physicsInit = (engine: Matter.Engine) => {
        engine.world.gravity.y = 0;
        const collision = extractTmxCollisionComposite(this.props.tileData.tmxJs);
        Matter.World.addComposite(engine.world, collision);

        // der Arbeitsamt
        this.props.addEnergySource({
            x: 1175,
            y: 630,
            radius: 200,
            energyAmount: Number.POSITIVE_INFINITY,
            lossDelta: 0,
            colorCode: 'rgba(255, 0, 0, .5)',
            playerGainEnergyDelta: () => -2,
            playerGainMoneyDelta: ({ money }) => (money < 100 ? 1.5 : 0),
        });

        // vong Häuslichkeit her, was für 1 Haus
        this.props.addEnergySource({
            x: 2600,
            y: 710,
            radius: 75,
            energyAmount: Number.POSITIVE_INFINITY,
            lossDelta: 0,
            colorCode: 'rgba(0, 255, 0, .7)',
            playerGainEnergyDelta: ({ food }) => (food > 0 ? 1 : -0.01),
            playerGainFoodDelta: ({ energy }) => (energy < 90 ? -0.5 : -0.01),
        });

        // Marktstand: teuer, aber gutes Essen und wenig Stress (weil auf welchem Parkplatz ist schon stressig)
        this.props.addEnergySource({
            x: 1890,
            y: 470,
            radius: 25,
            energyAmount: Number.POSITIVE_INFINITY,
            lossDelta: 0,
            colorCode: 'rgba(255, 255, 0, .7)',
            playerGainEnergyDelta: () => -1,
            playerGainMoneyDelta: () => -5,
            playerGainFoodDelta: ({ money }) => (money ? 8 : 0),
        });

        // süper market
        this.props.addEnergySource({
            x: 2070,
            y: 420,
            radius: 40,
            energyAmount: Number.POSITIVE_INFINITY,
            lossDelta: 0,
            colorCode: 'rgba(255, 255, 0, .7)',
            playerGainEnergyDelta: () => -4,
            playerGainMoneyDelta: () => -1,
            playerGainFoodDelta: ({ money }) => (money ? 2 : 0),
        });

        // Hydrant auf der Straße
        this.props.addEnergySource({
            x: 2295,
            y: 732,
            radius: 25,
            energyAmount: Number.POSITIVE_INFINITY,
            lossDelta: 0,
            colorCode: null,
            playerGainEnergyDelta: ({ energy }) => (energy > 70 ? 0.25 : -0.1),
        });

        Matter.Events.on(engine, 'collisionActive', (e: any) => {
            let totalDeltaEnergy = 0;
            let totalDeltaMoney = 0;
            let totalDeltaFood = 0;

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
                totalDeltaEnergy += energySourceData.playerGainEnergyDelta(this.props.playerStats) * factor;
                totalDeltaMoney += energySourceData.playerGainMoneyDelta(this.props.playerStats) * factor;
                totalDeltaFood += energySourceData.playerGainFoodDelta(this.props.playerStats) * factor;
            }

            if (totalDeltaEnergy !== 0) this.props.modifyEnergy(totalDeltaEnergy / 100);
            if (totalDeltaMoney !== 0) this.props.modifyMoney(totalDeltaMoney / 100);
            if (totalDeltaFood !== 0) this.props.modifyFood(totalDeltaFood / 100);
        });
    };
}

export default connect(
    ({ energySources, playerStats }: State) => ({ energySources, playerStats }),
    {
        modifyEnergy: playerStats.actions.modifyEnergy,
        modifyMoney: playerStats.actions.modifyMoney,
        modifyFood: playerStats.actions.modifyFood,

        addEnergySource: energySources.actions.addEnergySource,
    }
)(IntroWorld);
