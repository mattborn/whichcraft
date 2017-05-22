import React from 'react';
import moment from 'moment';

import Colors from '../constants/Colors';
import { scrollStyles } from '../constants/Styles';
import Type from '../constants/Type';

import Button from '../components/Button';

import firebase from '../firebase';

export default class Account extends React.Component {
    _logout = () => {
        this.props.app.setState({ page: 'brews' });
        firebase.signOut();
    };

    render() {
        const style = {
            account: { padding: 30 },
            image: {
                width: 100,
                height: 100,
                borderRadius: '50%',
                margin: '0 0 20px'
            },
            name: {
                fontSize: Type.large,
                margin: '0 0 5px'
            },
            email: {
                fontSize: Type.medium,
                margin: '0 0 5px'
            },
            since: {
                color: Colors.light,
                margin: '0 0 30px'
            },
            metrics: { margin: '0 0 40px' },
            brews: {
                width: 'calc(50% - 30px)',
                float: 'left',
                textAlign: 'right'
            },
            metric: {
                display: 'block',
                fontFamily: 'proxima-nova, sans-serif',
                fontSize: 60
            },
            label: {
                letterSpacing: '.1em',
                textTransform: 'uppercase'
            },
            from: {
                width: 60,
                color: Colors.light,
                float: 'left',
                padding: '30px 0 0'
            },
            breweries: {
                width: 'calc(50% - 30px)',
                float: 'left',
                textAlign: 'left'
            },
            upgrade: { margin: '0 0 20px' },
            signout: {}
        };
        Object.assign(style.account, scrollStyles);
        const app = this.props.app;
        const user = this.props.user;
        return (
            <div style={style.account}>
                <img src={'http://gravatar.com/avatar/' + user.gravatar + '?s=200'} style={style.image} />
                <h1 style={style.name}>{user.name}</h1>
                <p style={style.email}>{user.email}</p>
                <p style={style.since}>Since {moment(user.joined).format('MMMM YYYY')}</p>
                <div style={style.metrics}>
                    <div style={style.brews}>
                        <span style={style.metric}>{Object.keys(user.notes).length}</span>
                        <span style={style.label}>brews</span>
                    </div>
                    <div style={style.from}>from</div>
                    <div style={style.breweries}>
                        <span style={style.metric}>{'--' || Object.keys(user.breweries).length}</span>
                        <span style={style.label}>breweries</span>
                    </div>
                    <div style={{ clear: 'both' }} />
                </div>
                <Button
                    onClick={app.openPage.bind(null, 'upgrade', false)}
                    style={style.upgrade}
                    text="Upgrade to PRO"
                    treatment="primary"
                />
                <Button onClick={this._logout} style={style.signout} text="Sign out" treatment="cancel" />
            </div>
        );
    }
}
