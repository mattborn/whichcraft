import React from 'react';
import Colors from '../constants/Colors';

export default class AddButton extends React.Component {
    render() {
        var style = {
            button: {
                width: 50,
                height: 50,
                background: Colors.white,
                border: '1px solid ' + Colors.dark,
                borderRadius: 3,
                padding: 12,
                position: 'absolute',
                bottom: 30,
                right: 30
            },
            plus: {
                width: 24,
                height: 24
            }
        };
        return (
            <button onClick={this.props.onClick} style={style.button}>
                <svg style={style.plus} viewBox="0 0 100 100">
                    <polygon points="100,41.7 58.3,41.7 58.3,0 41.7,0 41.7,41.7 0,41.7 0,58.3 41.7,58.3 41.7,100 58.3,100 58.3,58.3
  100,58.3" />
                </svg>
            </button>
        );
    }
}
