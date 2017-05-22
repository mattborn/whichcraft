import React from 'react';
import Colors from '../constants/Colors';

export default class Alert extends React.Component {
    render() {
        var treatment = this.props.treatment || Colors.dark;
        var treatments = {
            error: Colors.error
        };
        var color = treatment ? treatments[treatment] : Colors.dark;
        var style = {
            border: '1px solid ' + color,
            borderRadius: 2,
            color: color,
            lineHeight: '18px',
            padding: '6px 10px'
        };
        return <p style={Object.assign(style, this.props.style)}>{this.props.text}</p>;
    }
}
