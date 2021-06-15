import React, { Component } from "react";
// Game subcomponents
import GameInfo from "../GameInfo";

class GameDice extends Component {

  render() {
    const { className, name, dice, rotation } = this.props;

    const generateDice = dice => {
      let elems = [];

      for (let i = 0; i < 3; ++i) {
        elems.push(
          <div
            className={`Dice ${"dice" + dice[i]}`}
            style={{transform:`rotate(${rotation}deg)`}}
          />
        );
      }
      return elems;
    };

    return (
      <div className={`Dice-Container${className ? " " + className : ""}`}>
        {generateDice(dice)}
      </div>
    );
  }
}

export default GameDice;
