import { rejects } from 'assert';
import Matter, { Bodies, Body, Composite } from 'matter-js';

export interface Layer {
    data: number[];
    height: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
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

export function layerToComposite(layer: Layer, { tilewidth, tileheight }: TmxJson): Composite {
    const composite = Composite.create();

    const rectMap: Array<Array<Rect>> = [];
    const getRect = (x: number, y: number): Rect | undefined => (rectMap[y] || [])[x];
    const setRect = (x: number, y: number, rect: Rect) => {
        if (!rectMap[y]) {
            rectMap[y] = [];
        }
        rectMap[y][x] = rect;
    };

    const buildRect = (x: number, y: number, width: number, height: number, options = { isStatic: true }) =>
        Bodies.rectangle(
            (x + width / 2) * tilewidth,
            (y + height / 2) * tileheight,
            width * tilewidth,
            height * tileheight,
            options
        );

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
    acc.forEach(rect => Composite.add(composite, buildRect(rect.x, rect.y, rect.width, rect.height)));

    return composite;
}

export function extractTmxCollisionComposite(tmx: TmxJson): Composite {
    const composite = Composite.create();

    for (const layer of tmx.layers) {
        if (layer.name.includes('collision')) {
            Composite.add(composite, layerToComposite(layer, tmx));
        }
    }
    return composite;
}
