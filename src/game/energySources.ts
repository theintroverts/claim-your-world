import Matter from 'matter-js';

import { COLLISION_CATEGORY, COLLISION_GROUP } from '../util/layer';

type PlayerGainHandler = ({ energy, money, food }: { energy: number; money: number; food: number }) => number;

export interface EnergySourceData {
    key: string;
    createdAt: Date;

    x: number;
    y: number;
    radius: number;

    energyAmount: number;
    lossDelta: number;

    colorCode: string;

    playerGainEnergyDelta: PlayerGainHandler;
    playerGainMoneyDelta: PlayerGainHandler;
    playerGainFoodDelta: PlayerGainHandler;
}

export const registerEnergySource = (world: Matter.World, data: EnergySourceData): Matter.Body => {
    const body = Matter.Bodies.circle(data.x, data.y, data.radius, {
        isSensor: true,
        isStatic: false,
        collisionFilter: {
            group: COLLISION_GROUP.OTHER,
            category: COLLISION_CATEGORY.OBJECT,
            mask: COLLISION_CATEGORY.PLAYER,
        },
    });

    Matter.World.addBody(world, body);

    energySources.set(body, data);

    if (Number.isFinite(data.energyAmount) && data.lossDelta !== 0) {
        const timeLeft = (data.energyAmount / data.lossDelta) * 1000;
        setTimeout(() => {
            console.log('better clear that fluff');
            // Matter.World.remove(world, body);
        }, timeLeft);
    }

    console.log(body);

    return body;
};

export const getEnergySourceData = (body: Matter.Body): EnergySourceData | undefined => {
    if (energySources.has(body)) {
        return energySources.get(body);
    }
    return undefined;
};

const energySources = new WeakMap<Matter.Body, EnergySourceData>();
