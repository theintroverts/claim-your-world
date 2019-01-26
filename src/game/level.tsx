import React, { Component } from "react";
import { Sprite, TileMap } from "react-game-kit";
import { TiledMap } from "./TiledMap";
export default class Level extends Component {
  render() {
    return (
      <div
        style={{
          position: "absolute",
          transform: `translate(${0}px, 0px) translateZ(0)`,
          transformOrigin: "top left"
        }}
      >
        {/* 
        <TileMap
          //columns={37}
          //rows={28}
          //width={628}
          //height={475}
          columns={8}
          rows={2}
          tileSize={16}
          src={require("../assets/roguelikeCity_magenta.png")}
          layers={[1, 1, 1, 3, 2, 4, 2, 1, 4, 2, 2, 1, 1, 4, 2, 5]}
        />*/}
        <TiledMap />
      </div>
    );
  }
}
