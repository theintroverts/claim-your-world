import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React from 'react';

import { EnergySourceData, registerEnergySource } from './energySources';

export default class EnergySource extends React.Component<EnergySourceData> {
    static contextTypes = {
        engine: PropTypes.object,
    };

    private body: Matter.Body | undefined;

    componentDidMount() {
        this.body = registerEnergySource(this.context.engine.world, this.props);
    }

    componentWillUnmount() {
        if (this.body !== undefined) {
            const { engine }: { engine: Matter.Engine } = this.context;
            Matter.World.remove(engine.world, this.body);
        }
    }

    render() {
        const { x, y, radius } = this.props;
        return (
            <svg
                style={{
                    position: 'absolute',
                    left: this.props.x - this.props.radius * 2,
                    top: this.props.y - this.props.radius * 2,
                    width: 4 * radius,
                    height: 4 * radius,
                }}
            >
                <filter id="blurMe">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={radius * 0.06} />
                </filter>

                <circle
                    cx={radius * 2}
                    cy={radius * 2}
                    r={radius}
                    fill={this.props.playerGainDelta < 0 ? 'rgba(255, 0, 0, .5)' : 'rgba(0, 255, 0, .7)'}
                    filter="url(#blurMe)"
                />
            </svg>
        );
    }

    getStyle(): React.CSSProperties {
        return {
            position: 'absolute',
            left: this.props.x - this.props.radius,
            top: this.props.y - this.props.radius,
            width: 2 * this.props.radius,
            height: 2 * this.props.radius,
            borderRadius: this.props.radius,
            background: this.props.playerGainDelta < 0 ? 'rgba(255, 0, 0, .5)' : 'rgba(0, 255, 0, .7)',
            filter: `blur(${this.props.radius / 2}px)`,
        };
    }
}
