import React from 'react';

import Colors from '../constants/Colors';
import Type from '../constants/Type';

export default class Input extends React.Component {
    _focus = e => {
        e.currentTarget.style.borderColor = Colors.dark;
    };

    _blur = e => {
        e.currentTarget.style.borderColor = Colors.light;
    };

    render() {
        const { treatment, style, inputRef, ...props } = this.props;
        const styles = {
            width: '100%',
            fontSize: Type.medium,
            margin: '0 0 20px'
        };
        const treatments = {
            default: {
                border: '1px solid ' + Colors.light,
                padding: 10
            },
            thin: {
                borderBottom: '1px solid ' + Colors.light,
                padding: '10px 0'
            }
        };
        Object.assign(styles, treatments[treatment || 'default'], style);

        return <input onFocus={this._focus} onBlur={this._blur} style={styles} ref={inputRef} {...props} />;
    }
}
