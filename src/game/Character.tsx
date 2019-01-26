import Matter from 'matter-js';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Body as GameKitBody, KeyListener } from 'react-game-kit';
import { connect } from 'react-redux';

import { playerLocation, State } from '../store';

export interface Props {
    keys: KeyListener;
    x: number;
    y: number;

    setCharacterPosition: (_: { x: number; y: number }) => void;
}

class Character extends React.Component<Props> {
    static contextTypes = {
        engine: PropTypes.object,
        scale: PropTypes.number,
    };

    componentDidMount() {
        Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
    }

    move = (x: number, y: number) => {
        const body = this.bodyRef.current;
        if (body && body.body) {
            Matter.Body.setVelocity(body.body as any, { x, y });
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

        this.move(
            keys.isDown(keys.LEFT) ? -WALK_SPEED : keys.isDown(keys.RIGHT) ? WALK_SPEED : 0,
            keys.isDown(keys.UP) ? -WALK_SPEED : keys.isDown(keys.DOWN) ? WALK_SPEED : 0
        );
    };

    getWrapperStyles(): React.CSSProperties {
        const { x, y } = this.props;

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
                <GameKitBody args={[x, y, 34, 64]} inertia={Infinity} ref={this.bodyRef}>
                    <img src="dude.png" />
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
