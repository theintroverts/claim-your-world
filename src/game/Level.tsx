import React, { Component } from 'react';

import { TileData } from '../util/layer';
import { TiledMap } from './TiledMap';

export default class Level extends Component<{ tileData: TileData }> {
    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    transform: `translate(${0}px, 0px) translateZ(0)`,
                    transformOrigin: 'top left',
                }}
            >
                <TiledMap {...this.props.tileData} />
            </div>
        );
    }
}
