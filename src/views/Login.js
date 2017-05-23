import React from 'react';

import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from '../components/Link';
import Logomark from '../components/Logomark';
import Logotype from '../components/Logotype';

import firebase from '../firebase';

export default class Login extends React.Component {
    static displayName = 'Login';

    state = {
        error: false,
        validated: false
    };

    componentDidMount() {
        this._validate();
    }

    _validate = () => {
        const email = this._email.value;
        const password = this._password.value;

        if (email && password) {
            this.setState({ validated: true });
        } else {
            this.setState({ validated: false });
        }
        this.setState({ error: false });
    };

    _submit = e => {
        const email = this._email.value;
        const password = this._password.value;

        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
            if (error) {
                this.setState({ error: true });
            }
        });
    };

    render() {
        const style = {
            login: { padding: '0 40px' },
            head: { padding: '80px 0 40px' },
            logomark: {
                width: 80,
                height: 80,
                display: 'block',
                margin: '0 auto 20px'
            },
            logotype: {
                width: 154,
                height: 25
            },
            submit: {
                margin: '0 0 20px'
            },
            forgot: {
                width: '100%',
                margin: '0 0 20px',
                textAlign: 'left'
            }
        };
        return (
            <div style={style.login}>
                <div style={style.head}>
                    <Logomark style={style.logomark} />
                    <Logotype style={style.logotype} />
                </div>
                <form onSubmit={this._submit}>
                    <Input
                        onChange={this._validate}
                        placeholder="email"
                        inputRef={el => (this._email = el)}
                        treatment="thin"
                        type="email"
                    />
                    <Input
                        onChange={this._validate}
                        placeholder="password"
                        inputRef={el => (this._password = el)}
                        treatment="thin"
                        type="password"
                    />
                    <Button
                        disabled={!this.state.validated}
                        style={style.submit}
                        text="Sign in"
                        treatment="submit"
                        type="submit"
                    />
                </form>
                {this.state.validated && <Link style={style.forgot} text="Forgot password" />}
                {this.state.error && <Alert text="Bummer. Wrong email or password." treatment="error" />}
            </div>
        );
    }
}
