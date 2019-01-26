import Matter, { Bodies, Composite } from 'matter-js';

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

export function layerToComposite(layer: Layer): Composite {
    const composite = Composite.create();

    for (let dx = 0; dx < layer.width; dx++) {
        for (let dy = 0; dy < layer.height; dy++) {
            const x = layer.x + dx;
            const y = layer.y + dy;
            const value = layer.data[y * layer.width + x];

            if (value) {
                Composite.add(composite, Bodies.rectangle(x, y, 1, 1, { isStatic: true }));
            }
        }
    }

    return composite;
}

export function extractTmxCollisionComposite(tmx: TmxJson): Composite {
    const composite = Composite.create();

    for (const layer of tmx.layers) {
        if (layer.name.includes('collision')) {
            Composite.add(composite, layerToComposite(layer));
        }
    }

    return composite;
}
