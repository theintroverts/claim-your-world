import * as React from 'react';

interface Props {
    text: string;
    style?: React.CSSProperties;
    className?: string;
}

interface State {
    loaded: boolean;
}
const charMap = require('../assets/fonts/good_neighbors.json');

export class PixelFont extends React.Component<Props, State> {
    private canvas = React.createRef<HTMLCanvasElement>();
    private canvasPainted = false;
    private img: HTMLImageElement;
    public state = {
        loaded: false,
    };

    public constructor(props: Props) {
        super(props);
        this.img = document.createElement('img');
        this.img.onload = () => this.setState({ loaded: true });
        this.img.src = require('../assets/fonts/good_neighbors.png');
    }

    private drawText = (text: string) => {
        if (this.canvasPainted || !this.canvas.current || !this.state.loaded) {
            return;
        }

        const chars: Array<[number, number, string, string]> = [];
        for (let c of text) {
            if (c === ' ') {
                c = String.fromCharCode(127);
            }
            if (!charMap[c]) {
                throw new Error(`unknown character '${c}'`);
            }
            const charLeft = charMap[c];
            const nextChar = String.fromCharCode(c.charCodeAt(0) + 1);
            const charRight = charMap[nextChar];
            chars.push([charLeft, charRight, c, nextChar]);
        }
        const width = chars.reduce((acc, [l, r]) => acc + r - l, 0);

        this.canvas.current.width = width;

        const ctx = this.canvas.current.getContext('2d')!;
        let pos = 0;
        for (const [l, r] of chars) {
            ctx.drawImage(this.img, l, 0, r - l, 16, pos, 0, r - l, 16);
            pos += r - l;
        }
    };

    public componentDidMount() {
        if (this.canvas.current && !this.canvasPainted) {
            this.drawText(this.props.text);
        }
    }

    public componentWillReceiveProps(newProps: Props, newState: State) {
        if (newProps.text !== this.props.text || this.state.loaded !== newState.loaded) {
            this.drawText(newProps.text);
        }
    }

    public render() {
        return <canvas ref={this.canvas} height={16} style={this.props.style} className={this.props.className} />;
    }
}
