import React, { Component } from 'react';
import { Sprite, TileMap } from 'react-game-kit';

import { TiledMap } from './TiledMap';

export default class Level extends Component {
    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    transform: `translate(${0}px, 0px) translateZ(0)`,
                    transformOrigin: 'top left',
                }}
            >
                <TiledMap />
            </div>
        );
    }
}
