import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React from 'react';
import { Body as GameKitBody, KeyListener, Sprite } from 'react-game-kit';
import { connect } from 'react-redux';

import { EnergySourceCreationData, energySources, playerLocation, playerStats, State } from '../store';

export interface Props {
    x: number;
    y: number;

    addEnergySource: (x: EnergySourceCreationData) => void;
}

export interface YoshiEggState {
    x: number;
    y: number;
}

class YoshiEgg extends React.Component<Props, YoshiEggState> {
    static contextTypes = {
        engine: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);

        this.state = { ...this.props };
    }

    componentDidMount() {
        Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
    }

    update = () => {
        const bodyRef = this.bodyRef.current;

        if (!bodyRef || !bodyRef.body) {
            return;
        }

        const x = Math.round(10 * bodyRef.body.position.x) / 10;
        const y = Math.round(10 * bodyRef.body.position.y) / 10;

        if (this.state.x !== x || this.state.y !== y) {
            this.setState({ x, y });
        }

        const casaLocX = 2600;
        const casaLocY = 710;
        const casaDistance = Math.sqrt((casaLocX - x) ** 2 + (casaLocY - y) ** 2);

        if (casaDistance < 75 && !this.spawned) {
            this.spawned = true;
            this.props.addEnergySource({
                x,
                y,
                radius: 50,
                energyAmount: Number.POSITIVE_INFINITY,
                lossDelta: 0,
                colorCode: 'rgba(0, 255, 0, .7)',
                playerGainEnergyDelta: () => 0.33,
            });
        }
    };

    getWrapperStyles(): React.CSSProperties {
        const { x, y } = this.state;

        return {
            position: 'absolute',
            left: x,
            top: y,
        };
    }

    render() {
        const { x, y } = this.props;

        return (
            <div style={this.getWrapperStyles()}>
                <GameKitBody
                    args={[x, y, 24, 24]}
                    inertia={Infinity}
                    ref={this.bodyRef}
                    /*collisionFilter={{
                        group: COLLISION_GROUP.PLAYER,
                        category: COLLISION_CATEGORY.PLAYER,
                        mask: COLLISION_CATEGORY.ALL,
                    }} */
                >
                    <img src="yoshiegg.png" style={{ transform: 'translateX(-13px) translateY(-40px)' }} />
                </GameKitBody>
            </div>
        );
    }

    private bodyRef = React.createRef<GameKitBody>();
    private spawned: boolean = false;
}

export default connect(
    undefined,
    {
        addEnergySource: energySources.actions.addEnergySource,
    }
)(YoshiEgg);
