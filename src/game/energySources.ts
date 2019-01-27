import Matter from 'matter-js';

import { COLLISION_CATEGORY, COLLISION_GROUP } from '../util/layer';

type PlayerGainHandler = ({ energy, money, food }: { energy: number; money: number; food: number }) => number;

export interface EnergySourceData {
    id: string;
    createdAt: Date;

    x: number;
    y: number;
    radius: number;

    energyAmount: number;
    lossDelta: number;

    colorCode: string | null;

    playerGainEnergyDelta: PlayerGainHandler;
    playerGainMoneyDelta: PlayerGainHandler;
    playerGainFoodDelta: PlayerGainHandler;
}

export const linkEnergySource = (key: string, body: Matter.Body) => {
    linkedEnergySources[key] = body;
};

export const getEnergySourceLink = (key: string): Matter.Body | undefined => {
    return linkedEnergySources[key];
};

export const registerEnergySource = (world: Matter.World, data: EnergySourceData): Matter.Body => {
    const body = Matter.Bodies.circle(data.x, data.y, data.radius, {
        isSensor: true,
        isStatic: false,
        collisionFilter: {
            group: COLLISION_GROUP.NEVER_COLLIDES,
            category: COLLISION_CATEGORY.SENSOR,
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

    return body;
};

export const getEnergySourceData = (body: Matter.Body): EnergySourceData | undefined => {
    if (energySources.has(body)) {
        return energySources.get(body);
    }
    return undefined;
};

const energySources = new WeakMap<Matter.Body, EnergySourceData>();
const linkedEnergySources: { [key: string]: Matter.Body } = {};
