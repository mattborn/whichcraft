import $ from 'jquery';
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
        note: null
    };

    state = {
        brew: '',
        brewery: '',
        validated: false,
        liked: null
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.brew.name != this.state.brew.name) {
            this._name.value = this.state.brew.name;
        }
        if (prevState.brewery.name != this.state.brewery.name) {
            this._brewery.value = this.state.brewery.name;
        }
    }

    componentDidMount() {
        const note = this.props.note;
        this._validate();
        if (note) {
            this.bindAsObject(firebase.database().ref('brews').child(note.brew), 'brew');
            this.bindAsObject(firebase.database().ref('breweries').child(note.brewery), 'brewery');
            if (typeof note.liked != 'undefined') this.setState({ liked: note.liked });
        }
    }

    createBrewery = name => {
        // Add Brewery
        const breweryRef = firebase.database().ref('breweries').push();
        const breweryId = breweryRef.key();
        firebase.database().ref('breweries').child(breweryId).set({
            // city: city,
            name: name
        });
        return breweryId;
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
        // TODO: Check if the brewery already exists in Firebase
        const breweryId = this.createBrewery(brewery);

        // Create brew
        // TODO: Check if the brew already exists in Firebase
        const brewRef = firebase.database().ref('brews').push();
        const brewId = brewRef.key();
        firebase.database().ref('brews').child(brewId).set({
            name: name,
            brewery: breweryId
        });

        // Get some brew + brewery data from BreweryDB
        // TODO: Make sure we match the correct brew
        // TODO: Provide some error handling, since this is somewhat fragile
        $.ajax({
            url: 'https://www.kimonolabs.com/api/ondemand/cmagu84i?apikey=EgIYTM8HavTvDWxbAro1VOHSEB4fsRAP&kimmodify=1',
            crossDomain: true,
            dataType: 'jsonp',
            data: {
                q: name + ' ' + brewery
            },
            success: function(data) {
                // Yucky hardcoded bullshit
                if (data['data']) data = data['data'][0];
                if (data) {
                    firebase.database().ref('brews').child(brewId).update({
                        abv: data['abv'] ? data['abv'] : '',
                        style: data['style'] ? data['style']['name'] : ''
                    });
                }
            },
            error: function(xhr, status) {
                console.log(status);
            }
        });

        const noteRef = firebase.database().ref('users').child(this.props.user).child('notes').push();
        const noteId = noteRef.key();
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

        $.ajax({
            url: 'https://www.kimonolabs.com/api/ondemand/cmagu84i?apikey=EgIYTM8HavTvDWxbAro1VOHSEB4fsRAP&kimmodify=1',
            crossDomain: true,
            dataType: 'jsonp',
            data: {
                q: name + ' ' + brewery
            },
            success: data => {
                // Yucky hardcoded bullshit
                if (data['data']) data = data['data'][0];
                if (data) {
                    firebase.database().ref('brews').child(this.props.note.brew).update({
                        abv: data['abv'] ? data['abv'] : '',
                        style: data['style'] ? data['style']['name'] : ''
                    });
                }
            },
            error: function(xhr, status) {
                console.log(status);
            }
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
                    defaultValue={this.state.brew.name}
                    inputRef={el => (this._name = el)}
                />
                <Label htmlFor="breweryName" text="Brewery name" />
                <Input
                    id="breweryName"
                    onChange={this._validate}
                    placeholder="3 Floyds Brewing Co."
                    defaultValue={this.state.brewery.name}
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
