import React from 'react';

import Colors from '../constants/Colors';
import Type from '../constants/Type';
import { maxLandscape, scrollStyles } from '../constants/Styles';

import firebase from '../firebase';

export default class Status extends React.Component {
    state = {
        online: false,
        unique_brews: null,
        unique_breweries: null,
        total_users: null
    };

    componentWillMount() {
        firebase.database().ref().once('value', snapshot => {
            // TODO: replace total_brews with recursive count of each users’ brews
            this.setState({
                online: true,
                unique_brews: snapshot.child('brews').numChildren(),
                unique_breweries: snapshot.child('breweries').numChildren(),
                total_brews: snapshot.child('brews').numChildren(),
                total_users: snapshot.child('users').numChildren()
            });
        });
    }

    render() {
        const style = {
            status: { padding: '30px 0' },
            title: {
                fontSize: Type.large,
                margin: '0 0 20px'
            },
            server: {
                border: '1px solid ' + Colors.dark,
                display: 'inline-block',
                fontSize: Type.medium,
                lineHeight: '38px',
                padding: '0 20px'
            },
            quadrant: {
                width: '50%',
                borderColor: Colors.dark,
                borderStyle: 'solid',
                float: 'left',
                padding: '25px 0'
            },
            first: { borderWidth: '0 1px 1px 0' },
            second: { borderWidth: '0 0 1px 0' },
            third: { borderWidth: '0 1px 0 0' },
            fourth: { borderWidth: 0 },
            metric: {
                font: '36px proxima-nova, sans-serif',
                margin: '10px 0 0'
            },
            label: {
                letterSpacing: '.1em',
                textTransform: 'uppercase'
            },
            from: {
                color: Colors.light,
                fontSize: Type.small,
                margin: '15px 0 0'
            },
            heading: { fontSize: Type.medium }
        };
        Object.assign(style.status, maxLandscape, scrollStyles);

        return (
            <div style={style.status}>
                <h1 style={style.title}>Status</h1>
                <span style={style.server}>
                    Server is {this.state.online ? 'ONLINE' : <span style={style.offline}>OFFLINE</span>}
                </span>
                <div>
                    <div style={Object.assign(style.first, style.quadrant)}>
                        <p style={style.metric}>{this.state.unique_brews}</p>
                        <p style={style.label}>Brews</p>
                        <p style={style.from}>from</p>
                        <p style={style.metric}>{this.state.unique_breweries}</p>
                        <p style={style.label}>Breweries</p>
                    </div>
                    <div style={Object.assign(style.second, style.quadrant)}>
                        <p style={style.metric}>{this.state.total_brews}</p>
                        <p style={style.label}>Total Brews</p>
                        <p style={style.from}>from</p>
                        <p style={style.metric}>{this.state.total_users}</p>
                        <p style={style.label}>Users</p>
                    </div>
                    <div style={Object.assign(style.third, style.quadrant)}>
                        <p style={style.heading}>Active Users</p>
                        <p style={style.metric}>--</p>
                        <p style={style.label}>Past Day</p>
                        <p style={style.metric}>--</p>
                        <p style={style.label}>Past Week</p>
                    </div>
                    <div style={Object.assign(style.fourth, style.quadrant)}>
                        <p style={style.heading}>Brews Added</p>
                        <p style={style.metric}>--</p>
                        <p style={style.label}>Past Day</p>
                        <p style={style.metric}>{this.state.total_users}</p>
                        <p style={style.label}>Past Week</p>
                    </div>
                    <div style={{ clear: 'both' }} />
                </div>
            </div>
        );
    }
}
