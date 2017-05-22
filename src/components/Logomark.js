import React from 'react';

export default class Logomark extends React.Component {
    render() {
        return (
            <svg style={this.props.style} viewBox="0 0 100 96">
                <path d="M86,2h1c0.6,0,1-0.4,1-1s-0.4-1-1-1H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h1C12,2,0,34,0,50c0,30,22.4,46,50,46s50-16,50-46C100,34,86,2,86,2z" />
            </svg>
        );
    }
}
