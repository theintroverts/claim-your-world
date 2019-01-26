import PropTypes from 'prop-types';
import React from 'react';

import { EnergySourceData, registerEnergySource } from './energySources';

export default class EnergySource extends React.Component<EnergySourceData> {
    static contextTypes = {
        engine: PropTypes.object,
    };

    componentDidMount() {
        registerEnergySource(this.context.engine.world, this.props);
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
            background: 'lightgreen',
            filter: `blur(${this.props.radius / 2}px)`,
        };
    }
}
