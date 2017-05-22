import React from 'react';

import Type from '../constants/Type';

export default class Rating extends React.Component {
    render() {
        var style = {
            icon: {
                width: 20,
                height: 20,
                margin: '0 5px 0 0',
                verticalAlign: 'middle'
            },
            text: {
                fontSize: Type.small,
                fontWeight: 600,
                letterSpacing: '.05em',
                textTransform: 'uppercase'
            }
        };
        var liked = this.props.liked;
        if (!liked) style.icon.transform = style.icon.WebkitTransform = 'rotate(180deg)';
        var icon = (
            <svg style={style.icon} viewBox="0 0 92.3 100">
                <path d="M89.4,55.9c0.4,1.3,0.5,2.8,0.5,4.1c0,3-0.8,6-2.3,8.7c0.1,0.8,0.2,1.7,0.2,2.6c0,3.8-1.3,7.7-3.6,10.7c0.1,11.4-7.6,18-18.7,18h-2.2h-5.6c-8.5,0-16.5-2.5-24.4-5.3c-1.7-0.6-6.6-2.4-8.3-2.4H7.7c-4.3,0-7.7-3.4-7.7-7.7V46.2c0-4.3,3.4-7.7,7.7-7.7h16.5c2.3-1.6,6.4-7,8.2-9.3c2-2.6,4.1-5.2,6.4-7.7c3.6-3.8,1.7-13.3,7.7-19.2C48,0.8,49.9,0,51.9,0c6.3,0,12.3,2.2,15.2,8.1c1.9,3.7,2.1,7.2,2.1,11.2c0,4.2-1.1,7.8-2.9,11.5h10.6c8.3,0,15.4,7,15.4,15.3C92.3,49.6,91.3,53,89.4,55.9z M11.5,76.9c-2.1,0-3.8,1.7-3.8,3.8s1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8S13.6,76.9,11.5,76.9z M76.9,38.5H55.8c0-7,5.8-12.1,5.8-19.2c0-7-1.4-11.5-9.6-11.5c-3.8,3.9-1.9,13.1-7.7,19.2c-1.7,1.7-3.1,3.6-4.6,5.5c-2.7,3.5-9.9,13.8-14.6,13.8h-1.9v38.5H25c3.4,0,8.9,2.2,12.1,3.3c6.6,2.3,13.5,4.4,20.6,4.4H65c6.8,0,11.5-2.7,11.5-10c0-1.1-0.1-2.3-0.3-3.4c2.5-1.4,3.9-4.8,3.9-7.6c0-1.4-0.4-2.9-1.1-4.1c2-1.9,3.2-4.3,3.2-7.2c0-1.9-0.8-4.7-2.1-6.2c2.8-0.1,4.5-5.5,4.5-7.7C84.6,42.1,81,38.5,76.9,38.5z" />
            </svg>
        );
        return liked
            ? <p style={this.props.style}>{icon} <span style={style.text}>Would drink again</span></p>
            : <p style={this.props.style}>{icon} <span style={style.text}>Would not drink again</span></p>;
    }
}
