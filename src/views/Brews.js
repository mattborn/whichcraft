import React from 'react';

import Type from '../constants/Type';
import { scrollStyles } from '../constants/Styles';

import AddButton from '../components/AddButton';
import BrewItem from '../components/BrewItem';
import Button from '../components/Button';

export default class Brews extends React.Component {
    static defaultProps = {
        notes: []
    };

    render() {
        var style = {
            brews: { padding: '15px 0' },
            empty: { padding: '145px 0 0' },
            empty_title: {
                fontSize: Type.large,
                margin: '0 0 30px'
            },
            empty_text: {
                fontSize: Type.medium,
                lineHeight: 1.3,
                margin: '0 0 40px'
            }
        };
        Object.assign(style.brews, scrollStyles);
        var app = this.props.app;
        var notes = this.props.notes;

        return (
            <div style={style.brews}>
                {notes.length
                    ? notes.reverse().map((note, index) => {
                        return <BrewItem app={app} index={index} note={note} key={note['.key']} />;
                    })
                    : <div style={style.empty}>
                          <h1 style={style.empty_title}>Which craft beers <br />have you had?</h1>
                          <p style={style.empty_text}>You haven’t added <br />any brews, yet.</p>
                          <Button text="I have one right now." />
                      </div>}
                <AddButton onClick={app._openPopover.bind(null, 'add')} />
            </div>
        );
    }
}
