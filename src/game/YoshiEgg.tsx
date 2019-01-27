import Matter from 'matter-js';
import PropTypes from 'prop-types';
import React from 'react';
import { Body as GameKitBody, KeyListener, Sprite } from 'react-game-kit';

export interface Props {
    x: number;
    y: number;
}

export interface State {
    x: number;
    y: number;
}

export default class YoshiEgg extends React.Component<Props, State> {
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

        if (bodyRef && bodyRef.body) {
            const x = Math.round(10 * bodyRef.body.position.x) / 10;
            const y = Math.round(10 * bodyRef.body.position.y) / 10;

            if (this.state.x !== x || this.state.y !== y) {
                this.setState({ x, y });
            }
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
}
