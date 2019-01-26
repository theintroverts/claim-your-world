import Matter, { Render } from 'matter-js';
import PropTypes from 'prop-types';
import * as React from 'react';
import { KeyListener } from 'react-game-kit';

import { TmxJson, TsxJson } from '../util/layer';

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

    getWrapperStyles(): React.CSSProperties {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
        };
    }

    render() {
        const {
            tmxJs: { width, tilewidth, height, tileheight },
        } = this.props;
        const { debugEnabled } = this.state;

        if (debugEnabled && this.canvas.current && !this.debugRender) {
            this.debugRender = Render.create({
                canvas: this.canvas.current!,
                engine: this.context.engine,
                options: {
                    enabled: true,
                    width: width * tilewidth,
                    height: height * tileheight,
                    pixelRatio: 0.5,
                    background: false,
                    wireframeBackground: false,
                    wireframes: false,
                    showSleeping: false,
                    showDebug: false,
                    showBroadphase: false,
                    showBounds: false,
                    showVelocity: true,
                    showCollisions: true,
                    showSeparations: false,
                    showAxes: false,
                    showPositions: false,
                    showAngleIndicator: false,
                    showIds: false,
                    showShadows: false,
                    showVertexNumbers: false,
                    showConvexHulls: false,
                    showInternalEdges: false,
                    showMousePosition: false,
                } as any,
            });
            Render.run(this.debugRender);
        }

        return (
            <div style={{ ...this.getWrapperStyles() }}>
                <canvas
                    ref={this.canvas}
                    style={{
                        width: width * tilewidth,
                        height: height * tileheight,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
            </div>
        );
    }

    private canvas = React.createRef<HTMLCanvasElement>();
    private debugRender?: Render;
}
