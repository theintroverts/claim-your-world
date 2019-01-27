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
        const { x, y, radius, colorCode } = this.props;

        if (colorCode === null) {
            return <div />;
        }

        return (
            <svg
                style={{
                    position: 'absolute',
                    left: x - radius * 2,
                    top: y - radius * 2,
                    width: 4 * radius,
                    height: 4 * radius,
                }}
            >
                <filter id="blurMe">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={radius * 0.06} />
                </filter>

                <circle cx={radius * 2} cy={radius * 2} r={radius} fill={colorCode} filter="url(#blurMe)" />
            </svg>
        );
    }
}
