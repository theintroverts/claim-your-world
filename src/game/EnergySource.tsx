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
        return <div style={this.getStyle()} />;
    }

    getStyle(): React.CSSProperties {
        return {
            position: 'absolute',
            left: this.props.x - this.props.radius,
            top: this.props.y - this.props.radius,
            width: 2 * this.props.radius,
            height: 2 * this.props.radius,
            borderRadius: this.props.radius,
            background: 'rgba(0, 255, 0, .7)',
            filter: `blur(${this.props.radius / 2}px)`,
        };
    }
}
