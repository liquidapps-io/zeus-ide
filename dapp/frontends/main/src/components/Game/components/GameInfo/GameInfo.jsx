import React, { Component } from 'react';

class Info extends Component {
  render() {
    // Extract data and event functions from props
    const { className, onEndGame } = this.props;
    // Display:
    // Round number: 18 <-- ((max deck = 17) + 1) - Deck Cards - Hand Cards
    // Rules button to trigger a modal
    // Button to end the current game
    return (
      <div className={`Info${ className ? ' ' + className : '' }`}>
        { <p>ROUND <span className="round-number">{ 18 }/17</span></p> }
        <div>QUIT</div>
      </div>
    )
  }
}

export default Info;
