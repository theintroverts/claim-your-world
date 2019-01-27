import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { State } from '../store';
import { PixelFont } from './PixelFont';

const GameStats: FunctionComponent<State['playerStats']> = props => (
    <ul>
        <li className="energy">
            <PixelFont text={props.energy.toFixed(1)} />
        </li>
        <li className="money">
            <PixelFont text={props.money.toFixed(1)} />
        </li>
        <li className="food">
            <PixelFont text={props.food.toFixed(1)} />
        </li>
    </ul>
);

export default connect(({ playerStats }: State) => ({ ...playerStats }))(GameStats);
