declare module 'react-game-kit' {
    import { ComponentType } from 'react';
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
    export const AudioPlayer: any;
    export const Loop: React.ComponentType<{}>;
    export const Stage: React.ComponentType<Partial<{ height: number; width: number; style: any }>>;
    export const KeyListener: any;
    export const Body: any;
    export const TileMap: any;
    export const World: React.ComponentType<{
        gravity?: number;
        onCollision?: Function;
        onInit?: Function;
        onUpdate?: Function;
    }>;
}
