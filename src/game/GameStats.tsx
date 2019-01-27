import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { State } from '../store';
import { PixelFont } from './PixelFont';

const GameStats: FunctionComponent<State['playerStats']> = props => (
    <ul>
        <li className="energy">
            <span className="label">
                <PixelFont text="Energie:" />
            </span>
            <PixelFont text={props.energy.toFixed(1)} />
        </li>
        <li className="money">
            <span className="label">
                <PixelFont text="Geld:" />
            </span>
            <PixelFont text={props.money.toFixed(1)} />
        </li>
        <li className="food">
            <span className="label">
                <PixelFont text="Essen:" />
            </span>
            <PixelFont text={props.food.toFixed(1)} />
        </li>
    </ul>
);

export default connect(({ playerStats }: State) => ({ ...playerStats }))(GameStats);
