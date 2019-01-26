import React, { Component, FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { playerLocation, State } from '../store';

export interface Props {
    energy: number;
}

const GameStats: FunctionComponent<Props> = props => (
    <table>
        <tr>
            <td>Enery Level</td>
            <td>{props.energy}</td>
        </tr>
    </table>
);

export default connect(({ playerStats: { energy } }: State) => ({ energy }))(GameStats);
