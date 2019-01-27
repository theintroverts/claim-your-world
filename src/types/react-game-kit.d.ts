declare module 'react-game-kit' {
    import { ComponentType } from 'react';
    import { Body as MatterBody } from 'matter-js';

    /**
     * The Sprite component lets you define sprite animations using sprite sheets. When creating a sprite sheet, define sprite tile dimensions that will be provided via the tileHeight & tileWidth props. Next, each animation state is represented by a row, with steps of the animation represented as columns.
     */
    export const Sprite: React.ComponentType<
        Partial<{
            offset: [number, number];
            onPlayStateChanged: Function;
            repeat: boolean;
            scale: number;
            src: string;
            state: number;
            steps: Array<any>;
            ticksPerFrame: number;
            tileHeight: number;
            tileWidth: number;
        }>
    >;
    declare class AudioPlayer {
        constructor(url: string, callback: () => void);
        play(options: undefined | { loop?: boolean; volume?: numeric; offset?: numeric });
        context: any;
        buffer: any;
    }
    export const Loop: React.ComponentType<{}>;
    export const Stage: React.ComponentType<Partial<{ height: number; width: number; style: any }>>;
    export class KeyListener {
        LEFT: number;
        RIGHT: number;
        UP: number;
        DOWN: number;
        SPACE: number;

        subscribe(keys: number[]): void;
        unsubscribe(): void;
        isDown(key: number): boolean;
    }

    declare class Body extends React.Component<{
        shape?: 'rectangle' | 'circle';
        args: number[];
        inertia: number;
        [key: string]: any;
    }> {
        body: MatterBody;
    }

    export const TileMap: React.ComponentType<{}>;

    export const World: React.ComponentType<{
        gravity?: number;
        onCollision?: Function;
        onInit?: Function;
        onUpdate?: Function;
    }>;
}
