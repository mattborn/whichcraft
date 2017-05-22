import React from 'react';
import Colors from '../constants/Colors';
import Type from '../constants/Type';

export default class Button extends React.Component {
    render() {
        var disabled = this.props.disabled;
        var treatment = this.props.treatment || 'primary';
        var style = {
            lineHeight: '18px',
            padding: '11px 20px'
        };
        var tiny = {
            width: '100%',
            fontSize: Type.small,
            fontWeight: 600,
            letterSpacing: '.1em',
            padding: '13px',
            textTransform: 'uppercase'
        };
        var treatments = {
            cancel: Object.assign({}, tiny, { color: Colors.light }),
            menu: {
                width: '100%',
                fontSize: Type.large,
                letterSpacing: '.1em',
                lineHeight: '30px',
                textTransform: 'uppercase'
            },
            primary: {
                background: Colors.dark,
                borderRadius: 3,
                color: Colors.white,
                fontSize: Type.medium
            },
            submit: {
                width: '100%',
                background: Colors.dark,
                borderRadius: 3,
                color: Colors.white,
                fontSize: Type.normal,
                fontWeight: 600,
                letterSpacing: '.1em',
                padding: '14px',
                textTransform: 'uppercase'
            },
            tiny: Object.assign(tiny, { color: Colors.dark })
        };
        if (treatment) {
            Object.assign(style, treatments[treatment]);
        }
        if (disabled) {
            Object.assign(style, { background: Colors.light });
        }
        var type = this.props.type || 'button';
        return (
            <button
                disabled={disabled}
                onClick={this.props.onClick}
                style={Object.assign(style, this.props.style)}
                type={type}
            >
                <span className="button-text">{this.props.text}</span>
            </button>
        );
    }
}
