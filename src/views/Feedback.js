import React from 'react';

import { maxLandscape } from '../constants/Styles';

import Center from '../components/Center';

export default class Feedback extends React.Component {
    render() {
        var style = {
            feedback: {}
        };
        Object.assign(style.feedback, maxLandscape);
        return (
            <Center>
                <div style={style.feedback}>
                    Feedback
                </div>
            </Center>
        );
    }
}
