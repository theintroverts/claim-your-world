import Matter from 'matter-js';
import PropTypes from 'prop-types';
import * as React from 'react';
import { KeyListener } from 'react-game-kit';

import { Layer, layerToRects, TmxJson, TsxJson } from '../util/layer';

type Props = {
    tmxJs: TmxJson;
    tsxJs: TsxJson;
    keys: KeyListener;
};

type State = {
    debugEnabled: boolean;
    visibleLayers: string[];
};

export class Debug extends React.Component<Props, State> {
    static contextTypes = {
        engine: PropTypes.object,
    };
    state = {
        debugEnabled: false,
        visibleLayers: ['collision01', 'collision02'],
    };

    componentDidMount() {
        Matter.Events.on(this.context.engine, 'afterUpdate', this.checkKeys);
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, 'afterUpdate', this.checkKeys);
    }

    checkKeys = () => {
        if (this.props.keys.isDown(80)) {
            this.setState({ debugEnabled: true });
        }
    };

    async drawCanvas() {
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
                this.drawCanvasLayer(layer, ctx);
                this.lastDrawnCanvasLayers[l] = canvas;
            }
        }
    }

    drawCanvasLayer(layer: Layer, ctx: CanvasRenderingContext2D) {
        const rects = layerToRects(layer, this.props.tmxJs);

        for (const { x, y, width, height } of rects) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.rect(x, y, width, height);
            ctx.stroke();
            ctx.restore();
        }
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
            tmxJs: { layers, width, tilewidth, height, tileheight },
        } = this.props;
        const { debugEnabled } = this.state;

        if (!debugEnabled) {
            return null;
        }

        this.drawCanvas();

        return (
            <div style={{ ...this.getWrapperStyles() }}>
                {layers.map(
                    (layer, idx) =>
                        this.state.visibleLayers.includes(layer.name) && (
                            <canvas
                                key={idx}
                                ref={this.canvasLayers[idx]}
                                width={width * tilewidth}
                                height={height * tileheight}
                                style={{
                                    width: width * tilewidth,
                                    height: height * tileheight,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                            />
                        )
                )}
            </div>
        );
    }

    private canvasLayers = this.props.tmxJs.layers.map(() => React.createRef<HTMLCanvasElement>());
    private lastDrawnCanvasLayers: HTMLCanvasElement[] = new Array(this.props.tmxJs.layers.length);
}
