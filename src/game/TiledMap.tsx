import * as React from "react";
import PropTypes from "prop-types";

export interface Layer {
  data: number[];
  height: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface Tileset {
  firstgid: number;
  source: string;
}

export interface TmxJson {
  height: number;
  infinite: boolean;
  layers: Layer[];
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: Tileset[];
  tilewidth: number;
  type: string;
  version: number;
  width: number;
}

export interface TsxJson {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  type: string;
}

const tmxJs: TmxJson = require("../assets/ClaimYourWorld.tmx.json");
const tsxJs: TsxJson = require("../assets/ClaimYourWorld.tsx.json");

/*
<svg width="5cm" height="4cm" version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
	<image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/>
</svg>
*/

type Props = {
  tmxJs: TmxJson;
  tsxJs: TsxJson;
};

export class TiledMap extends React.Component<Props> {
  static defaultProps = { tmxJs, tsxJs };

  shouldComponentUpdate(nextProps: Props, nextState: {}, nextContext: any) {
    return this.context.scale !== nextContext.scale;
  }

  generateMap() {
    const {
      tmxJs: { layers, width, height }
    } = this.props;

    const mappedLayers: React.ReactNode[] = [];

    for (let l = 0; l < layers.length; l++) {
      const layer = layers[l];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const gridIndex = y * width + x;
          if (layer.data[gridIndex] === 0) {
            continue;
          }
          mappedLayers.push(this.getTile({ x, y }, layer.data[gridIndex], l));
        }
      }
    }

    return mappedLayers;
  }

  getTile({ x, y }: { x: number; y: number }, tileIndex: number, l: number) {
    const {
      tsxJs: { columns: cols, tileheight, tilewidth, spacing }
    } = this.props;
    const { scale } = this.context;

    const flip_horiz = 0x80000000 & tileIndex;
    const flip_vert = 0x40000000 & tileIndex;
    const flip_diag = 0x20000000 & tileIndex;
    const realTileIndex = (tileIndex & 0x1fffffff) - 1;

    const tileX = realTileIndex % cols;
    const tileY = Math.floor(realTileIndex / cols);

    const posX = x * tilewidth * scale;
    const posY = y * tileheight * scale;

    const imageWrapperStyle: React.CSSProperties = {
      height: tileheight,
      width: tilewidth,
      overflow: "hidden",
      position: "absolute",
      zIndex: l,
      transform:
        `translate(${posX}px, ${posY}px) ` +
        ` scaleX(${(flip_horiz ? -1 : 1) * scale}) ` +
        ` scaleY(${(flip_vert ? -1 : 1) * scale}) ` +
        `${!flip_diag ? "" : " rotate(90deg) scaleY(-1)"}`
    };

    const left = tileX * (tilewidth + spacing);
    const top = tileY * (tileheight + spacing);

    const imageStyle: React.CSSProperties = {
      position: "absolute",
      imageRendering: "pixelated",
      display: "block",
      transform: ` translate(-${left}px, -${top}px) `
    };

    return (
      <div key={`tile-${l}-${x}-${y}`} style={imageWrapperStyle}>
        <img style={imageStyle} src={this.tileFileName} />
      </div>
    );
  }

  get tileFileName() {
    return `tiles/${this.props.tsxJs.image}`;
  }

  getLayerStyles() {
    return {
      position: "absolute",
      top: 0,
      left: 0
    } as React.CSSProperties;
  }

  getWrapperStyles() {
    return {
      position: "absolute",
      top: 0,
      left: 0
    } as React.CSSProperties;
  }

  render() {
    if (!this.context.scale) {
      return null;
    }

    const layers = this.generateMap();
    return (
      <div style={{ ...this.getWrapperStyles() }}>
        {layers.map((layer, index) => {
          return (
            <div key={`layer-${index}`} style={this.getLayerStyles()}>
              {layer}
            </div>
          );
        })}
      </div>
    );
  }

  static contextTypes = {
    scale: PropTypes.number
  };
}
