import React from 'react';
import ReactFireMixin from './components/ReactFire';
import Mousetrap from 'mousetrap';

import Colors from './constants/Colors';
import { scrollStyles } from './constants/Styles';

import Loading from './components/Loading';
import Menu from './components/Menu';

import Account from './views/Account';
import Brew from './views/Brew';
import Breweries from './views/Breweries';
import BrewForm from './views/BrewForm';
import Brews from './views/Brews';
import Confirm from './views/Confirm';
import Feedback from './views/Feedback';
import Login from './views/Login';
import Status from './views/Status';
import Upgrade from './views/Upgrade';

import firebase from './firebase';
import './App.css';

class App extends React.Component {
    static displayName = 'App';

    state = {
        menuOpen: false,
        popoverOpen: false,
        page: 'brews',
        popover: 'add',
        user: null,
        notes: [],
        currentNote: 0
    };

    componentWillMount() {
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                self.bindAsObject(firebase.database().ref('users').child(user.uid), 'user');
                self.bindAsArray(firebase.database().ref('users').child(user.uid).child('notes'), 'notes');
                self.setState({
                    uid: user.uid
                });
            } else {
                self.setState({
                    user: false,
                    uid: null,
                    notes: []
                });
            }
        });
    }

    componentDidMount() {
        Mousetrap.bind('esc', this._closePopover);
    }

    componentWillUnmount() {
        Mousetrap.unbind('esc', this._closePopover);
    }

    openPage = (page, toggleMenu, e) => {
        this.setState({ page: page });
        if (toggleMenu) this._toggleMenu(e);
    };

    _openPopover = (popover, e) => {
        this.setState({
            popover: popover,
            popoverOpen: true
        });
        e.preventDefault();
    };

    _closePopover = e => {
        this.setState({
            popover: null,
            popoverOpen: false
        });
        e.preventDefault();
    };

    _toggleMenu = e => {
        this.setState({ menuOpen: !this.state.menuOpen });
        e.preventDefault();
    };

    _setCurrentNote = (note, e) => {
        this.setState({ currentNote: note });
        this._openPopover('brew', e);
        e.preventDefault();
    };

    render() {
        console.log('App:render', this.state);
        var style = {
            app: {
                height: '100%',
                width: '100%',
                position: 'absolute',
                overflow: 'hidden',
                padding: '81px 0 0'
            },
            popover: {
                width: '100%',
                background: Colors.white,
                position: 'absolute',
                top: 0,
                left: this.state.popoverOpen ? 0 : '100%',
                transition: 'left .6s cubic-bezier(.1,1,.1,1)',
                transform: 'translateZ(0)'
            }
        };
        Object.assign(style.popover, scrollStyles);
        var user = this.state.user;
        var pages = {
            brews: <Brews app={this} notes={this.state.notes} />,
            breweries: <Breweries />,
            feedback: <Feedback />,
            account: <Account app={this} user={user} />,
            upgrade: <Upgrade app={this} />,
            status: <Status />
        };
        var popovers = {
            add: <BrewForm app={this} user={this.state.uid} />,
            edit: (
                <BrewForm
                    app={this}
                    user={this.state.uid}
                    note={this.state.notes[this.state.currentNote]}
                    noteId={this.state.user ? Object.keys(this.state.user.notes)[this.state.currentNote] : null}
                />
            ),
            brew: <Brew app={this} note={this.state.notes[this.state.currentNote]} />,
            confirm: <Confirm />
        };
        if (user === null) {
            return <Loading />;
        } else {
            return user
                ? <div style={style.app} onKeyDown={this._keydown}>
                      {pages[this.state.page]}
                      <Menu app={this} />
                      <div style={style.popover}>
                          {popovers[this.state.popover]}
                      </div>
                  </div>
                : <Login app={this} />;
        }
    }
}

export default ReactFireMixin(App);
