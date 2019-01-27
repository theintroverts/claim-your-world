import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React from 'react';
import { Body as GameKitBody, KeyListener, Sprite } from 'react-game-kit';
import { connect } from 'react-redux';
import UUID from 'uuid';

import { COLLISION_CATEGORY, COLLISION_GROUP } from '../../util/layer';
import { throttleExecution } from '../../util/limitRenders';
import { linkEnergySource } from '../energySources';
import { EnergySourceCreationData, energySources } from '../EnergySources/slice';

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

        this.state = { x: props.x, y: props.y };
    }

    componentDidMount() {
        Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
    }

    update = throttleExecution(() => {
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

        if (casaDistance < 75 && this.spawnId === undefined) {
            this.spawnId = UUID.v4();
            linkEnergySource(this.spawnId, bodyRef.body);
            this.props.addEnergySource({
                id: this.spawnId,
                x,
                y,
                radius: 50,
                energyAmount: Number.POSITIVE_INFINITY,
                lossDelta: 0,
                colorCode: 'rgba(0, 255, 0, .7)',
                playerGainEnergyDelta: () => 1.5,
            });
        }
    });

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
                    shape="circle"
                    args={[x, y, 12]}
                    inertia={Infinity}
                    ref={this.bodyRef}
                    collisionFilter={{
                        group: COLLISION_GROUP.CAN_COLLIDE,
                        category: COLLISION_CATEGORY.OBJECT,
                        mask: COLLISION_CATEGORY.PLAYER | COLLISION_CATEGORY.WALL | COLLISION_CATEGORY.OBJECT,
                    }}
                >
                    <img src="yoshiegg.png" style={{ position: 'absolute', left: -13, top: -23 }} />
                </GameKitBody>
            </div>
        );
    }

    private bodyRef = React.createRef<GameKitBody>();
    private spawnId: string | undefined;
}

export default connect(
    undefined,
    {
        addEnergySource: energySources.actions.addEnergySource,
    }
)(YoshiEgg);
