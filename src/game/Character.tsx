import Matter from 'matter-js';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Body as GameKitBody, KeyListener, Sprite } from 'react-game-kit';
import { connect } from 'react-redux';

import { playerLocation, State } from '../store';

export interface Props {
    keys: KeyListener;
    x: number;
    y: number;

    setCharacterPosition: (_: { x: number; y: number }) => void;
}

export interface CharacterState {
    spriteState: number;
    isMoving: boolean;
}

class Character extends React.Component<Props, CharacterState> {
    static contextTypes = {
        engine: PropTypes.object,
        scale: PropTypes.number,
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
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
    }

    move = (x: number, y: number) => {
        const body = this.bodyRef.current;
        if (body && body.body) {
            Matter.Body.setVelocity(body.body, { x, y });
            this.setState({ isMoving: x !== 0 || y !== 0 });
        }
    };

    update = () => {
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
    };

    checkKeys = () => {
        const { keys } = this.props;
        const WALK_SPEED = 3;

        let velocityX = 0;
        let velocityY = 0;
        let spriteState: number | undefined;

        if (keys.isDown(keys.LEFT)) {
            velocityX = -WALK_SPEED;
            spriteState = 1;
        }

        if (keys.isDown(keys.RIGHT)) {
            velocityX = WALK_SPEED;
            spriteState = 2;
        }

        if (keys.isDown(keys.UP)) {
            velocityY = -WALK_SPEED;
            spriteState = 3;
        }

        if (keys.isDown(keys.DOWN)) {
            velocityY = WALK_SPEED;
            spriteState = 0;
        }

        if (spriteState !== undefined) {
            this.setState({ spriteState });
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
                <GameKitBody args={[x, y, 12, 12]} inertia={Infinity} ref={this.bodyRef}>
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
}

export default connect(
    ({ playerLocation: { x, y } }: State) => ({ x, y }),
    {
        setCharacterPosition: playerLocation.actions.setCharacterPosition,
    }
)(Character);
