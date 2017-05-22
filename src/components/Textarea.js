import React from 'react';

import Colors from '../constants/Colors';
import Type from '../constants/Type';

export default class Textarea extends React.Component {
    _focus = e => {
        e.currentTarget.style.borderColor = Colors.dark;
    };

    _blur = e => {
        e.currentTarget.style.borderColor = Colors.light;
    };

    render() {
        var style = {
            width: '100%',
            border: '1px solid ' + Colors.light,
            fontSize: Type.medium,
            margin: '0 0 20px',
            padding: 10
        };

        return (
            <textarea
                id={this.props.id}
                onFocus={this._focus}
                onBlur={this._blur}
                defaultValue={this.props.defaultValue}
                placeholder={this.props.placeholder}
                ref={this.props.textareaRef}
                style={Object.assign(style, this.props.style)}
            />
        );
    }
}
