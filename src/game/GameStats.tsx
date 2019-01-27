import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { State } from '../store';
import { PixelFont } from './PixelFont';

export interface Props {
    energy: number;
	money: number;
}

const GameStats: FunctionComponent<Props> = props => (
	<ul>
		<li class="energy">
			<PixelFont text={props.energy.toFixed(1)} />
		</li>
		<li class="money">
			<PixelFont text={props.money.toFixed(1)} />
		</li>
	</ul>
);

export default connect(({ playerStats: { energy, money } }: State) => ({ energy, money }))(GameStats);
