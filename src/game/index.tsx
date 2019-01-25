import React, { Component } from "react";
import Matter from "matter-js";

import { AudioPlayer, Loop, Stage, KeyListener, World } from "react-game-kit";
import Level from "./level";

export default class Game extends Component {
  componentDidMount() {
    this.keyListener.subscribe([
      this.keyListener.LEFT,
      this.keyListener.RIGHT,
      this.keyListener.UP,
      this.keyListener.SPACE,
      65
    ]);
  }

  componentWillUnmount() {
    this.keyListener.unsubscribe();
  }

  render() {
    return (
      <Loop>
        <Stage style={{ background: "#3a9bdc" }}>
          <World onInit={this.physicsInit}>
            <Level />
          </World>
        </Stage>
      </Loop>
    );
  }

  public physicsInit = (engine: Matter.Engine) => {
    return;
    const ground = Matter.Bodies.rectangle(512 * 3, 448, 1024 * 3, 64, {
      isStatic: true
    });

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true
    });

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  };

  private keyListener = new KeyListener();
}
