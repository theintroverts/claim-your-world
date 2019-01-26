import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { State } from '../store';
import { PixelFont } from './PixelFont';

export interface Props {
    energy: number;
}

const GameStats: FunctionComponent<Props> = props => (
    <table>
        <tbody>
            <tr>
                <td>
                    <PixelFont text="Energy Level" />
                </td>
                <td>
                    <PixelFont text={props.energy.toFixed(1)} />
                </td>
            </tr>
        </tbody>
    </table>
);

export default connect(({ playerStats: { energy } }: State) => ({ energy }))(GameStats);
