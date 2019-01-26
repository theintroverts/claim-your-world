import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { State } from '../store';

export interface Props {
    energy: number;
}

const GameStats: FunctionComponent<Props> = props => (
    <table>
        <tr>
            <td>Enery Level</td>
            <td>{props.energy.toFixed(1)}</td>
        </tr>
    </table>
);

export default connect(({ playerStats: { energy } }: State) => ({ energy }))(GameStats);
