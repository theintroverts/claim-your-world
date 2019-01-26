import PropTypes from 'prop-types';
import * as React from 'react';

import { Layer, TmxJson, TsxJson } from '../util/layer';

type Props = {
    tmxJs: TmxJson;
    tsxJs: TsxJson;
};
type State = {
    tilemapLoaded: boolean;
};

export class TiledMap extends React.Component<Props, State> {
    state = { tilemapLoaded: false };
    tilemapImage?: HTMLImageElement;

    componentDidMount() {
        if (!this.tilemapImage) {
            this.setState({
                tilemapLoaded: false,
            });
            const img = document.createElement('img');
            img.src = this.tileFileName;
            img.onload = () => this.setState({ tilemapLoaded: true });
            this.tilemapImage = img;
        }
    }

    async drawCanvas(tileSet: HTMLImageElement) {
        const {
            tmxJs: { layers },
        } = this.props;

        for (let l = 0; l < layers.length; l++) {
            const layer = layers[l];
            const canvas = this.canvasLayers[l].current;
            const lastDrawnCanvas = this.lastDrawnCanvasLayers[l];
            if (canvas && canvas !== lastDrawnCanvas) {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return;
                }
                this.drawCanvasLayer(layer, ctx, tileSet);
                this.lastDrawnCanvasLayers[l] = canvas;
            }
        }
    }

    drawCanvasLayer(layer: Layer, ctx: CanvasRenderingContext2D, tileSet: HTMLImageElement) {
        const {
            tmxJs: { width, height },
        } = this.props;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const gridIndex = y * width + x;
                if (layer.data[gridIndex] === 0) {
                    continue;
                }
                ctx.save();
                this.drawCanvasTile({ x, y }, layer.data[gridIndex], ctx, tileSet);
                ctx.restore();
            }
        }
    }

    drawCanvasTile(
        { x, y }: { x: number; y: number },
        tileIndex: number,
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

    getWrapperStyles(): React.CSSProperties {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
        };
    }

    render() {
        const {
            tmxJs: { layers },
        } = this.props;

        if (this.tilemapImage && this.state.tilemapLoaded) {
            this.drawCanvas(this.tilemapImage);
        }

        return (
            <div style={{ ...this.getWrapperStyles() }}>
                {layers.map((layer, idx) => (
                    <canvas
                        key={idx}
                        ref={this.canvasLayers[idx]}
                        width={800}
                        height={500}
                        style={{
                            width: 800,
                            height: 500,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    />
                ))}
            </div>
        );
    }

    private canvasLayers = this.props.tmxJs.layers.map(() => React.createRef<HTMLCanvasElement>());
    private lastDrawnCanvasLayers: HTMLCanvasElement[] = new Array(this.props.tmxJs.layers.length);
}
