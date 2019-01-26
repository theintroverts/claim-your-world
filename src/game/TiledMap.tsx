import PropTypes from 'prop-types';
import * as React from 'react';

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

const tmxJs: TmxJson = require('../assets/ClaimYourWorld.tmx.json');
const tsxJs: TsxJson = require('../assets/ClaimYourWorld.tsx.json');

/*
<svg width="5cm" height="4cm" version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
	<image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/>
</svg>
*/

type Props = {
    tmxJs: TmxJson;
    tsxJs: TsxJson;
};

export class TiledMap extends React.Component<Props> {
    static defaultProps = { tmxJs, tsxJs };
    private canvas = React.createRef<HTMLCanvasElement>();
    private lastDrawnCanvas?: HTMLCanvasElement;

    shouldComponentUpdate(nextProps: Props, nextState: {}, nextContext: any) {
        return this.context.scale !== nextContext.scale;
    }

    async drawCanvas() {
        console.log('draw');
        const canvas = this.canvas.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        this.lastDrawnCanvas = canvas;

        const {
            tmxJs: { layers, width, height },
        } = this.props;

        const img = document.createElement('img');
        img.src = this.tileFileName;
        img.onload = () => {
            for (let l = 0; l < layers.length; l++) {
                const layer = layers[l];
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const gridIndex = y * width + x;
                        if (layer.data[gridIndex] === 0) {
                            continue;
                        }
                        ctx.save();
                        this.drawCanvasTile({ x, y }, layer.data[gridIndex], l, ctx, img);
                        ctx.restore();
                    }
                }
            }
        };
    }

    drawCanvasTile(
        { x, y }: { x: number; y: number },
        tileIndex: number,
        l: number,
        ctx: CanvasRenderingContext2D,
        tileset: HTMLImageElement
    ) {
        const {
            tsxJs: { columns: cols, tileheight, tilewidth, spacing },
        } = this.props;
        const flip_horiz = 0x80000000 & tileIndex;
        const flip_vert = 0x40000000 & tileIndex;
        const flip_diag = 0x20000000 & tileIndex;
        const realTileIndex = (tileIndex & 0x1fffffff) - 1;

        const tileX = realTileIndex % cols;
        const tileY = Math.floor(realTileIndex / cols);

        const posX = x * tilewidth;
        const posY = y * tileheight;

        let left = tileX * (tilewidth + spacing);
        let top = tileY * (tileheight + spacing);

        ctx.translate(posX, posY);

        if (flip_horiz) {
            ctx.translate(tilewidth, 0);
            ctx.scale(-1, 1);
        }
        if (flip_vert) {
            ctx.translate(0, tileheight);
            ctx.scale(1, -1);
        }
        if (flip_diag) {
            ctx.rotate(Math.PI / 2);
            ctx.scale(1, -1);
        }

        ctx.drawImage(tileset, left, top, tilewidth, tileheight, 0, 0, tilewidth, tileheight);
    }

    get tileFileName() {
        return `tiles/${this.props.tsxJs.image}`;
    }

    getWrapperStyles() {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scaleX(${this.context.scale}) scaleY(${this.context.scale})`,
        } as React.CSSProperties;
    }

    render() {
        if (!this.context.scale) {
            return null;
        }

        if (this.canvas.current && this.canvas.current !== this.lastDrawnCanvas) {
            this.drawCanvas();
        }

        return (
            <div style={{ ...this.getWrapperStyles() }}>
                <canvas ref={this.canvas} width={800} height={500} style={{ width: 800, height: 500 }} />
            </div>
        );
    }

    static contextTypes = {
        scale: PropTypes.number,
    };
}
