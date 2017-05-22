import React from 'react';
import ReactFireMixin from '../components/ReactFire';

import Colors from '../constants/Colors';
import Type from '../constants/Type';

import Button from '../components/Button';
import Logomark from '../components/Logomark';
import Rating from '../components/Rating';

import firebase from '../firebase';

class Brew extends React.Component {
    static displayName = 'Brew';

    static propTypes = {
        note: React.PropTypes.shape({
            brew: React.PropTypes.string.isRequired,
            brewery: React.PropTypes.string.isRequired,
            text: React.PropTypes.string,
            liked: React.PropTypes.bool
        })
    };

    state = {
        abv: '',
        brew: {
            name: ''
        },
        brewery: {
            name: '',
            city: ''
        }
    };

    componentDidMount() {
        const note = this.props.note;
        if (note) {
            this.bindAsObject(firebase.database().ref('brews').child(note.brew), 'brew');
            this.bindAsObject(firebase.database().ref('breweries').child(note.brewery), 'brewery');
        }
    }

    render() {
        const style = {
            wrap: {
                padding: '50px 50px 0'
            },
            logomark: {
                width: 40,
                height: 40,
                display: 'block',
                margin: '0 auto 40px'
            },
            name: {
                fontSize: 30,
                fontWeight: 400,
                margin: '0 0 15px'
            },
            brewery: {
                color: Colors.light,
                fontSize: Type.medium,
                fontWeight: 600
            },
            city: {
                color: Colors.light,
                lineHeight: '20px',
                margin: '0 0 15px'
            },
            other: { margin: '0 0 20px' },
            style: { margin: '0 20px 0 0' },
            abv: { fontSize: Type.small },
            rule: {
                width: 40,
                height: 1,
                background: Colors.dark,
                border: 'initial',
                margin: '30px auto'
            },
            notes: {
                lineHeight: '20px',
                margin: '0 0 20px'
            },
            rating: { margin: '0 0 20px' }
        };
        const brew = this.state.brew;
        const brewery = this.state.brewery;
        const note = this.props.note;
        const app = this.props.app;

        return (
            <div style={style.wrap}>
                <Logomark style={style.logomark} />
                <h1 style={style.name}>{brew.name}</h1>
                <p style={style.brewery}>{brewery.name}</p>
                <p style={style.city}>{brewery.city}</p>
                <p style={style.other}>
                    <span style={style.style}>{brew.style}</span>
                    {brew.abv && <span>{brew.abv}% <span style={style.abv}>ABV</span></span>}
                </p>
                <hr style={style.rule} />
                <p style={style.notes}>{note.text}</p>
                {typeof note.liked != 'undefined' && <Rating liked={note.liked} style={style.rating} />}
                <Button text="Edit" treatment="tiny" onClick={app._openPopover.bind(null, 'edit')} />
                <Button onClick={app._closePopover} text="Back to brews" treatment="cancel" />
            </div>
        );
    }
}

export default ReactFireMixin(Brew);
