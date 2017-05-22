import React from 'react';

import { maxLandscape } from '../constants/Styles';

import Center from '../components/Center';

export default class Breweries extends React.Component {
    render() {
        const style = {
            breweries: {}
        };
        Object.assign(style.breweries, maxLandscape);
        return (
            <Center>
                <div style={style.breweries}>
                    Breweries
                </div>
            </Center>
        );
    }
}
