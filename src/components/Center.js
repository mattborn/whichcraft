import React from 'react';

export default class Center extends React.Component {
    render() {
        var style = {};
        if (this.props.column)
            Object.assign(style, {
                flexDirection: 'column'
            });
        return (
            <div className="flex-center" style={style}>
                {this.props.children}
            </div>
        );
    }
}
