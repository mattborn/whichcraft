import React from 'react';

import Colors from '../constants/Colors';

export default class Link extends React.Component {
    render() {
        var style = {
            color: Colors.light,
            textDecoration: 'underline',
            textTransform: 'lowercase'
        };
        return (
            <button style={Object.assign(style, this.props.style)} type="button">
                <span className="button-text">{this.props.text}</span>
            </button>
        );
    }
}
