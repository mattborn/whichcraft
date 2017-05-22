import React from 'react';

import Button from '../components/Button';
import Center from '../components/Center';

export default class Confirm extends React.Component {
    render() {
        return (
            <Center>
                Are you sure you want to cancel?
                <Button text="Yep" />
                <Button text="Nope" treatment="tiny" />
            </Center>
        );
    }
}
