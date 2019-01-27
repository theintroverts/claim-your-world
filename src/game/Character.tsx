import Matter from 'matter-js';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Body as GameKitBody, KeyListener, Sprite } from 'react-game-kit';
import { connect } from 'react-redux';

import { playerLocation, playerStats, State } from '../store';
import { COLLISION_CATEGORY, COLLISION_GROUP } from '../util/layer';
import { getFpsMeasure, throttleExecution } from '../util/limitRenders';

export interface Props {
    keys: KeyListener;
    x: number;
    y: number;

    energy: number;

    setCharacterPosition: (_: { x: number; y: number }) => void;
    modifyEnergy: (energy: number) => void;
}

export interface CharacterState {
    spriteState: number;
    isMoving: boolean;
}

class Character extends React.Component<Props, CharacterState> {
    static contextTypes = {
        engine: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            spriteState: 0,
            isMoving: false,
        };
    }
    componentDidMount() {
        Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
        this.modifyEnergyTimerId = window.setInterval(() => this.props.modifyEnergy(-0.125), 250);
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, 'afterUpdate', this.update);

        if (this.modifyEnergyTimerId) {
            window.clearInterval(this.modifyEnergyTimerId);
        }
    }

    move = (x: number, y: number) => {
        const body = this.bodyRef.current;
        if (body && body.body) {
            Matter.Body.setVelocity(body.body, { x, y });
            this.setState(state => {
                const isMoving = x !== 0 || y !== 0;
                return isMoving === state.isMoving ? null : { isMoving };
            });
        }
    };

    private fpsCounter = getFpsMeasure(fps => console.log('character updates this second', fps));
    update = throttleExecution(() => {
        this.fpsCounter();
        const bodyRef = this.bodyRef.current;
        this.checkKeys();

        if (bodyRef && bodyRef.body) {
            const pos = {
                x: Math.round(1000 * bodyRef.body.position.x) / 1000,
                y: Math.round(1000 * bodyRef.body.position.y) / 1000,
            };

            if (this.props.x !== pos.x || this.props.y !== pos.y) {
                this.props.setCharacterPosition(pos);
            }
        }
    });

    checkKeys = () => {
        const { energy, keys } = this.props;
        const walkSpeed = energy < 15 ? 1 : energy < 25 ? 2 : 3.5;

        let velocityX = 0;
        let velocityY = 0;
        let spriteState: number | undefined;

        if (keys.isDown(keys.LEFT)) {
            velocityX = -walkSpeed;
            spriteState = 1;
        }

        if (keys.isDown(keys.RIGHT)) {
            velocityX = walkSpeed;
            spriteState = 2;
        }

        if (keys.isDown(keys.UP)) {
            velocityY = -walkSpeed;
            spriteState = 3;
        }

        if (keys.isDown(keys.DOWN)) {
            velocityY = walkSpeed;
            spriteState = 0;
        }

        if (spriteState !== undefined) {
            this.setState({ spriteState });
        }

        if (velocityX !== 0 && velocityY !== 0) {
            velocityX /= Math.sqrt(2);
            velocityY /= Math.sqrt(2);
        }

        this.move(velocityX, velocityY);
    };

    getWrapperStyles(): React.CSSProperties {
        const { x, y } = this.props;

        return {
            position: 'absolute',
            left: x,
            top: y,
            width: 12,
            height: 12,
            transform: 'translateX(-6px) translateY(-6px)',
        };
    }

    getSpriteWrapperStyle(): React.CSSProperties {
        return {
            transform: 'translateX(-2px) translateY(-12px)',
        };
    }

    render() {
        const { x, y } = this.props;

        return (
            <div style={this.getWrapperStyles()}>
                <GameKitBody
                    args={[x, y, 12, 12]}
                    inertia={Infinity}
                    ref={this.bodyRef}
                    collisionFilter={{
                        group: COLLISION_GROUP.CAN_COLLIDE,
                        category: COLLISION_CATEGORY.PLAYER,
                        mask: COLLISION_CATEGORY.ALL,
                    }}
                >
                    <div style={this.getSpriteWrapperStyle()}>
                        <Sprite
                            tileHeight={24}
                            tileWidth={16}
                            key={this.state.isMoving.toString()}
                            repeat={this.state.isMoving}
                            src="tiles/kavi.png"
                            scale={1}
                            state={this.state.spriteState}
                            steps={[3, 3, 3, 3]}
                        />
                    </div>
                </GameKitBody>
            </div>
        );
    }

    private bodyRef = React.createRef<GameKitBody>();
    private modifyEnergyTimerId: number | undefined;
}

export default connect(
    ({ playerStats: { energy }, playerLocation: { x, y } }: State) => ({ energy, x, y }),
    {
        setCharacterPosition: playerLocation.actions.setCharacterPosition,
        modifyEnergy: playerStats.actions.modifyEnergy,
    }
)(Character);
