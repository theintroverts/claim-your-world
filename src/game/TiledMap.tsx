import * as React from "react";

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

export class TiledMap extends React.Component<{
  tmxJs: TmxJson;
  tsxJs: TsxJson;
}> {
  static defaultProps = { tmxJs, tsxJs };

  render() {
    return <svg>{this.getTile({ x: 0, y: 0 }, 836)}</svg>;
  }

  getTile(targetPosition: { x: number; y: number }, tileIndex: number = 836) {
    const tileSize = 16;
    const gap = 1;
    const cols = 37;
    const rows = 28;

    const tileX = tileIndex % cols;
    const tileY = Math.floor(tileIndex / cols);

    const left = tileX * (tileSize + gap);
    const top = tileY * (tileSize + gap);

    return (
      <image
        href={this.tileFileName}
        x={0}
        y={0}
        width={16}
        height={16}
        transform={`translate(-${left} -${top})`}
      />
    );
  }

  get tileFileName() {
    return `tiles/${this.props.tsxJs.image}`;
  }
}
