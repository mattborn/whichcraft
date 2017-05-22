import React from 'react';

export default class Label extends React.Component {
    render() {
        var style = {
            display: 'block',
            fontWeight: 600,
            margin: '0 0 5px',
            textAlign: 'left'
        };
        return (
            <label htmlFor={this.props.htmlFor} style={Object.assign(style, this.props.style)}>
                {this.props.text}
            </label>
        );
    }
}
