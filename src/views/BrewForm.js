import React from 'react';
import ReactFireMixin from '../components/ReactFire';

import Colors from '../constants/Colors';
import Type from '../constants/Type';

import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Logomark from '../components/Logomark';
import Textarea from '../components/Textarea';

import firebase from '../firebase';

class BrewForm extends React.Component {
    static displayName = 'BrewForm';

    static defaultProps = {
        brew: '',
        brewery: '',
        note: null
    };

    state = {
        validated: false,
        liked: this.props.note ? this.props.note.liked : null
    };

    componentDidMount() {
        this._validate();
    }

    createBrewery = name => {
        return new Promise(resolve => {
            // Find matching breweries first.
            const ref = firebase.database().ref('breweries');
            ref.orderByChild('name').equalTo(name).limitToFirst(1).once('value', snapshot => {
                if (snapshot.numChildren()) {
                    const data = snapshot.val();
                    console.log(data);
                    resolve(Object.keys(data)[0]);
                } else {
                    // Add Brewery
                    const breweryId = ref.push({
                        // city: city,
                        name
                    }).key;

                    resolve(breweryId);
                }
            });
        });
    };

    createBrew = (name, breweryId) => {
        return new Promise(resolve => {
            // Create brew
            // Find matching brews first.
            const brewRef = firebase.database().ref('brews');
            brewRef.orderByChild('name').equalTo(name).limitToFirst(1).once('value', snapshot => {
                if (snapshot.numChildren()) {
                    const data = snapshot.val();
                    console.log(data);

                    resolve(Object.keys(data)[0]);
                } else {
                    // Add new brew
                    const brewId = brewRef.push({
                        name: name,
                        brewery: breweryId
                    }).key;

                    resolve(brewId);
                }
            });
        });
    };

    addBrewToBrewery = (breweryId, brewId) => {
        firebase.database().ref('breweries').child(breweryId).child('brews').child(brewId).set(true);
    };

    addBreweryToUser = breweryId => {
        firebase.database().ref('users').child(this.props.user).child('breweries').child(breweryId).set(true);
        firebase.database().ref('breweries').child(breweryId).child('users').child(this.props.user).set(true);
    };

    addBrewToUser = brewId => {
        firebase.database().ref('users').child(this.props.user).child('brews').child(brewId).set(true);
        firebase.database().ref('brews').child(brewId).child('users').child(this.props.user).set(true);
    };

    createNote = e => {
        e.preventDefault();
        const name = this._name.value;
        const brewery = this._brewery.value;
        const text = this._text.value;
        const liked = this.state.liked;

        // TODO: Provide some basic validation before closing popover
        this.props.app._closePopover(e);

        // Create brewery
        // TODO: Make this async/await
        this.createBrewery(brewery).then(breweryId => {
            this.createBrew(name, breweryId).then(brewId => {
                const noteRef = firebase.database().ref('users').child(this.props.user).child('notes').push();
                const noteId = noteRef.key;

                firebase.database().ref('users').child(this.props.user).child('notes').child(noteId).set({
                    brew: brewId,
                    brewery: breweryId,
                    text: text
                });

                if (liked != null) {
                    firebase.database().ref('users').child(this.props.user).child('notes').child(noteId).update({
                        liked: liked
                    });
                }

                // Add brew to brewery and both to current user
                this.addBrewToBrewery(breweryId, brewId);
                this.addBrewToUser(brewId);
                this.addBreweryToUser(breweryId);
            });
        });
    };

    updateNote = e => {
        e.preventDefault();
        const name = this._name.value;
        const brewery = this._brewery.value;
        const text = this._text.value;
        const liked = this.state.liked;

        this.props.app._closePopover(e);

        firebase.database().ref('brews').child(this.props.note.brew).update({
            name: name
        });

        firebase.database().ref('breweries').child(this.props.note.brewery).update({
            name: brewery
        });

        firebase.database().ref('users').child(this.props.user).child('notes').child(this.props.noteId).update({
            text: text
        });

        if (liked != null) {
            firebase.database().ref('users').child(this.props.user).child('notes').child(this.props.noteId).update({
                liked: liked
            });
        }
    };

    _validate = () => {
        const name = this._name.value;
        const brewery = this._brewery.value;

        if (name && brewery) {
            this.setState({ validated: true });
        } else {
            this.setState({ validated: false });
        }
        this.setState({ error: false });
    };

    _yep = () => {
        if (this.state.liked) this.setState({ liked: null });
        else this.setState({ liked: true });
    };

    _nope = () => {
        const liked = this.state.liked;
        if (liked !== null && !liked) this.setState({ liked: null });
        else this.setState({ liked: false });
    };

    render() {
        const liked = this.state.liked;
        const isNotLiked = liked !== null && !liked;
        const style = {
            form: { padding: 30 },
            logomark: {
                width: 40,
                height: 40,
                display: 'block',
                margin: '0 auto 10px'
            },
            title: {
                fontSize: Type.large,
                margin: '0 0 10px'
            },
            notes: { height: 100 },
            rating: {
                margin: '0 0 20px',
                whiteSpace: 'nowrap'
            },
            rating_text: {
                fontWeight: 600,
                margin: '0 15px 0 0'
            },
            yep: {
                background: liked ? Colors.dark : null,
                border: '1px solid ' + Colors.dark,
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                color: liked ? Colors.white : null,
                fontWeight: 600,
                padding: '5px 10px'
            },
            nope: {
                background: isNotLiked ? Colors.dark : null,
                borderColor: Colors.dark,
                borderStyle: 'solid',
                borderWidth: '1px 1px 1px 0',
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                color: isNotLiked ? Colors.white : null,
                fontWeight: 600,
                padding: '5px 10px'
            },
            save: {
                width: '100%',
                margin: '0 0 10px'
            }
        };
        const app = this.props.app;
        return (
            <form style={style.form} onSubmit={this.props.note ? this.updateNote : this.createNote}>
                <Logomark style={style.logomark} />
                <h1 style={style.title}>{this.props.note ? 'Edit brew' : 'Add brew'}</h1>
                <Label htmlFor="brewName" text="Brew name" />
                <Input
                    id="brewName"
                    onChange={this._validate}
                    placeholder="Zombie Dust"
                    defaultValue={this.props.brew.name}
                    inputRef={el => (this._name = el)}
                />
                <Label htmlFor="breweryName" text="Brewery name" />
                <Input
                    id="breweryName"
                    onChange={this._validate}
                    placeholder="3 Floyds Brewing Co."
                    defaultValue={this.props.brewery.name}
                    inputRef={el => (this._brewery = el)}
                />
                <Label htmlFor="notes" text="Notes" />
                <Textarea
                    id="notes"
                    textareaRef={el => (this._text = el)}
                    placeholder="Optional"
                    style={style.notes}
                    defaultValue={this.props.note ? this.props.note.text : ''}
                />
                <p style={style.rating}>
                    <span style={style.rating_text}>Would drink again?</span>
                    <button onClick={this._yep} style={style.yep} type="button">Yep</button>
                    <button onClick={this._nope} style={style.nope} type="button">Nope</button>
                </p>
                <Button disabled={!this.state.validated} style={style.save} type="submit" text="Save brew" />
                <Button onClick={app._closePopover} text="Cancel" treatment="cancel" />
            </form>
        );
    }
}

export default ReactFireMixin(BrewForm);
