import { Bodies, Composite } from 'matter-js';

export interface Layer {
    data?: number[];
    height: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
    layers?: Array<Layer>;
}

export interface Tileset {
    firstgid: number;
    source: string;
}

export interface TmxJson {
    height: number;
    infinite: boolean;
    layers: Layer[];
    nextobjectid: number;
    orientation: string;
    renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilesets: Tileset[];
    tilewidth: number;
    type: string;
    version: number;
    width: number;
}

export interface TsxJson {
    columns: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
    type: string;
}

export type TileData = {
    tmxJs: TmxJson;
    tsxJs: TsxJson;
};

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function layerToRects(layer: Layer, { tilewidth, tileheight }: TmxJson): Rect[] {
    const composite = Composite.create();

    const rectMap: Array<Array<Rect>> = [];
    const getRect = (x: number, y: number): Rect | undefined => (rectMap[y] || [])[x];
    const setRect = (x: number, y: number, rect: Rect) => {
        if (!rectMap[y]) {
            rectMap[y] = [];
        }
        rectMap[y][x] = rect;
    };

    const accumulateLayer = (layer: Layer) => {
        if (layer.data) {
            for (let dy = 0; dy < layer.height; dy++) {
                for (let dx = 0; dx < layer.width; dx++) {
                    const x = layer.x + dx;
                    const y = layer.y + dy;
                    const value = layer.data[dy * layer.width + dx];

                    if (value) {
                        let rect = { x, y, width: 1, height: 1 };
                        const left = getRect(x - 1, y);
                        if (left && left.height === 1) {
                            // grow right
                            left.width++;
                            rect = left;
                        }

                        const top = getRect(x, y - 1);
                        if (top && top.x == rect.x && top.width === rect.width) {
                            // grow bottom
                            for (let x1 = rect.x; x1 < rect.x + rect.width; x1++) {
                                setRect(x1, y, top);
                            }
                            top.height++;
                            rect = top;
                        }

                        setRect(x, y, rect);
                    }
                }
            }
        }

        const acc: Rect[] = [];
        for (const row of rectMap) {
            if (!row) {
                continue;
            }
            for (const rect of row) {
                if (rect && !acc.includes(rect)) {
                    acc.push(rect);
                }
            }
        }

        for (const subLayer of layer.layers || []) {
            acc.push(...accumulateLayer(subLayer));
        }

        return acc;
    };

    return accumulateLayer(layer).map(({ x, y, width, height }) => ({
        x: x * tilewidth,
        y: y * tileheight,
        width: width * tilewidth,
        height: height * tileheight,
    }));
}

export enum COLLISION_GROUP {
    CAN_COLLIDE = 0,
    NEVER_COLLIDES = -1,
}

export enum COLLISION_CATEGORY {
    ALL = -1,
    PLAYER = 1,
    WALL = 2,
    OBJECT = 4,
    SENSOR = 8,
}

export function extractTmxCollisionComposite(tmx: TmxJson): Composite {
    const composite = Composite.create();
    const options = {
        isStatic: true,
        collisionFilter: {
            group: COLLISION_GROUP.NEVER_COLLIDES,
            category: COLLISION_CATEGORY.WALL,
            mask: COLLISION_CATEGORY.PLAYER | COLLISION_CATEGORY.OBJECT,
        },
    };

    const buildRect = (x: number, y: number, width: number, height: number) =>
        Bodies.rectangle(x + width / 2, y + height / 2, width, height, options);

    for (const layer of tmx.layers) {
        if (layer.name.includes('collision')) {
            layerToRects(layer, tmx).forEach(rect =>
                Composite.add(composite, buildRect(rect.x, rect.y, rect.width, rect.height))
            );
        }
    }
    return composite;
}
