import PropTypes from 'prop-types';
import React from 'react';

export default class Scalator extends React.Component {
    static contextTypes = {
        loop: PropTypes.object,
        scale: PropTypes.number,
    };

    static childContextTypes = {
        loop: PropTypes.object,
        scale: PropTypes.number,
    };

    getChildContext() {
        return {
            scale: 1,
            loop: this.context.loop,
        };
    }

    getScaleStyles(): React.CSSProperties {
        return {
            transform: `scaleX(${this.context.scale}) scaleY(${this.context.scale})`,
            transformOrigin: 'top left',
        };
    }

    render() {
        return <div style={this.getScaleStyles()}>{this.props.children}</div>;
    }
}
