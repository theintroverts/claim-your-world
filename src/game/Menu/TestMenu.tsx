import * as React from 'react';

import BaseMenu from './BaseMenu';
import { CommonMenuProps } from './types';

const TestMenu = (props: CommonMenuProps) => (
    <BaseMenu
        {...props}
        rows={[
            { text: 'console.log("foo")', onSelect: () => console.log('foo') },
            { text: 'cancel', onSelect: props.closeTopMenu },
        ]}
    />
);

export default TestMenu;
