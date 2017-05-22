import React from 'react';
import Colors from '../constants/Colors';
import ReactFireMixin from '../components/ReactFire';

import firebase from '../firebase';

class BrewItem extends React.Component {
    static propTypes = {
        note: React.PropTypes.shape({
            brew: React.PropTypes.string.isRequired,
            brewery: React.PropTypes.string.isRequired,
            text: React.PropTypes.string,
            liked: React.PropTypes.bool
        })
    };

    state = {
        brew: {
            name: ''
        },
        brewery: {
            name: '',
            city: ''
        }
    };

    componentDidMount() {
        var note = this.props.note;
        if (note) {
            this.bindAsObject(firebase.database().ref('brews').child(note.brew), 'brew');
            this.bindAsObject(firebase.database().ref('breweries').child(note.brewery), 'brewery');
        }
    }

    render() {
        var style = {
            brew: {
                padding: '15px 30px',
                textAlign: 'left',
                cursor: 'pointer'
            },
            name: {
                fontSize: 16,
                lineHeight: '20px',
                pointerEvents: 'none'
            },
            brewery: {
                fontSize: 14,
                pointerEvents: 'none'
            },
            city: {
                color: Colors.light
            }
        };
        var brew = this.state.brew;
        var brewery = this.state.brewery;
        var app = this.props.app;
        return (
            <div style={style.brew} onClick={app._setCurrentNote.bind(null, this.props.index)}>
                <h1 style={style.name}>{brew.name}</h1>
                <p style={style.brewery}>{brewery.name} <span style={style.city}>{brewery.city}</span></p>
            </div>
        );
    }
}

export default ReactFireMixin(BrewItem);
