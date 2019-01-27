import * as React from 'react';

export interface WorldItem<T extends React.ComponentType<any> = React.ComponentType<any>> {
    Component: T;
    props: T extends React.ComponentType<infer P> ? P : never;
}
