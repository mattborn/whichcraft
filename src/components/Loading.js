import React from 'react';

import Center from './Center';

export default class Loading extends React.Component {
    render() {
        var style = {
            width: 40,
            height: 40,
            margin: '0 auto'
        };
        return (
            <Center>
                <img src="ball-triangle.svg" style={style} />
            </Center>
        );
    }
}
