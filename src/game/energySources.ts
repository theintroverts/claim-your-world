import Matter from 'matter-js';
import { Omit } from 'react-redux';

import { COLLISION_CATEGORY, COLLISION_GROUP } from '../util/layer';

interface EnergySourceData {
    createdAt: Date;
    radius: number;
    energyAmount: number;
    playerGainDelta: number;
    lossDelta: number;
}

export const createEnergySource = (
    data: Omit<EnergySourceData, 'createdAt'>,
    { world, x, y }: { world: Matter.World; x: number; y: number }
): Matter.Body => {
    const fullData = { ...data, createdAt: new Date() };

    const body = Matter.Bodies.circle(x, y, data.radius, {
        isSensor: true,
        isStatic: false,
        collisionFilter: {
            group: COLLISION_GROUP.OTHER,
            category: COLLISION_CATEGORY.OBJECT,
            mask: COLLISION_CATEGORY.PLAYER,
        },
    });

    Matter.World.addBody(world, body);

    energySources.set(body, fullData);

    if (Number.isFinite(fullData.energyAmount) && fullData.lossDelta !== 0) {
        const timeLeft = (fullData.energyAmount / fullData.lossDelta) * 1000;
        setTimeout(() => {
            Matter.World.remove(world, body);
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
