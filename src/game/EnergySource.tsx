import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React from 'react';

import { EnergySourceData, getEnergySourceLink, registerEnergySource } from './energySources';

export interface EnergySourceState {
    x: number;
    y: number;
}

export default class EnergySource extends React.Component<EnergySourceData, EnergySourceState> {
    static contextTypes = {
        engine: PropTypes.object,
    };

    private body: Matter.Body | undefined;
    private linkTo: Matter.Body | undefined;

    /*static getDerivedStateFromProps(props: EnergySourceData, state: EnergySourceState): EnergySourceState {
        return this.linkTo ? state : props;
    }*/

    constructor(props: EnergySourceData) {
        super(props);

        this.state = props;
        this.linkTo = getEnergySourceLink(props.id);
    }

    componentDidMount() {
        this.body = registerEnergySource(this.context.engine.world, this.props);

        if (this.linkTo) {
            Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
        }
    }

    componentWillUnmount() {
        if (this.body !== undefined) {
            const { engine }: { engine: Matter.Engine } = this.context;
            Matter.World.remove(engine.world, this.body);
        }

        Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
    }

    update = () => {
        if (this.linkTo === undefined || this.body === undefined) {
            return;
        }

        const x = Math.round(10 * this.linkTo.position.x) / 10;
        const y = Math.round(10 * this.linkTo.position.y) / 10;

        if (this.state.x !== x || this.state.y !== y) {
            this.setState({ x, y });
            Matter.Body.setPosition(this.body, { x, y });
            //this.body.position.x = x;
            //this.body.position.y = y;
        }
    };

    render() {
        const { radius, colorCode } = this.props;

        if (colorCode === null) {
            return <div />;
        }

        return (
            <svg
                style={{
                    position: 'absolute',
                    left: this.state.x - radius * 2,
                    top: this.state.y - radius * 2,
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
