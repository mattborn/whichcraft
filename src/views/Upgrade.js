import React from 'react';

import Type from '../constants/Type';
import { maxLandscape } from '../constants/Styles';

import Button from '../components/Button';

export default class Upgrade extends React.Component {
    _flagAccount = () => {
        console.log('TODO: add upgrade flag to database for this account');
    };

    render() {
        const style = {
            upgrade: { padding: 50 },
            title: {
                fontSize: Type.large,
                margin: '0 0 5px'
            },
            price: {
                fontSize: Type.large,
                margin: '0 0 20px'
            },
            text: {
                lineHeight: 1.3,
                margin: '0 0 30px'
            },
            primary: { margin: '0 0 20px' }
        };
        Object.assign(style.upgrade, maxLandscape);
        const app = this.props.app;

        return (
            <div style={style.upgrade}>
                <h1 style={style.title}>PRO</h1>
                <p style={style.price}>$50 / year</p>
                <p style={style.text}>
                    For now, WhichCraft is a beer-centric, glorified notepad. We want to keep the base app simple, but we know some users will want to do more. Before we dive in, we’re gauging how many of you want us to invest more time into building more features. Click below if this sounds like something you want.
                </p>
                <Button
                    onClick={this._flagAccount}
                    style={style.primary}
                    text="Yeah, I’m interested"
                    treatment="primary"
                />
                <Button onClick={app.openPage.bind(null, 'account', false)} text="Nevermind" treatment="cancel" />
            </div>
        );
    }
}
