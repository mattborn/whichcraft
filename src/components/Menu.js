import React from 'react';

import Colors from '../constants/Colors';

import Button from './Button';
import Center from './Center';
import Logotype from './Logotype';

export default class Menu extends React.Component {
    render() {
        var app = this.props.app;
        var style = {
            menu: {
                width: '100%',
                // height: document.documentElement.clientHeight,
                height: '100%',
                background: Colors.white,
                position: 'absolute',
                top: app.state.menuOpen ? 0 : 'calc(-100% + 81px)',
                left: 0,
                transition: 'top .6s cubic-bezier(.1,1,.1,1)',
                transform: 'translateZ(0)'
            },
            button: {
                width: '100%',
                height: 80,
                borderBottom: '1px solid ' + Colors.faint,
                padding: '20px 0 0',
                position: 'absolute',
                bottom: 0,
                left: 0
            },
            logotype: {}
        };

        return (
            <div style={style.menu}>
                <Center column="true">
                    <Button onClick={app.openPage.bind(null, 'brews', true)} text="Brews" treatment="menu" />
                    <Button onClick={app.openPage.bind(null, 'breweries', true)} text="Breweries" treatment="menu" />
                    <Button onClick={app.openPage.bind(null, 'account', true)} text="Account" treatment="menu" />
                    <Button onClick={app.openPage.bind(null, 'feedback', true)} text="Feedback" treatment="menu" />
                    <Button onClick={app.openPage.bind(null, 'status', true)} text="Status" treatment="menu" />
                </Center>
                <button onClick={app._toggleMenu} style={style.button} type="button">
                    <Logotype style={style.logotype} />
                </button>
            </div>
        );
    }
}
