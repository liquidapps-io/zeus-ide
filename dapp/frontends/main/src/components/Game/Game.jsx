// React core
import React, { Component } from "react";
import { connect } from "react-redux";
// Game subcomponents
import { Landing, Login, GameDice } from "./components";
// Services and redux action
import { UserAction } from "../../actions";
import { ApiService } from "../../services";

class Game extends Component {
  constructor(props) {
    // Inherit constructor
    super(props);
    // State for showing/hiding components when the API (blockchain) request is loading
    this.state = {
      isLoggingIn: false,
      loading: false,
      gameStatus: "Opponent's Turn",
      screenPlayerDice: [1, 1, 1],
      playerRotation: 0,
      screenEnemyDice: [1, 1, 1],
      enemyRotation: 0
    };
    // Bind functions
    this.loadUser = this.loadUser.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.closeLogin = this.closeLogin.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handlePlayCard = this.handlePlayCard.bind(this);
    this.handleNextRound = this.handleNextRound.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);
    // Call `loadUser` before mounting the app
    this.loadUser();
  }

  // Get latest user object from blockchain
  loadUser() {
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const {
      setUser,
      user: { name }
    } = { setUser: UserAction.setUser, user: { name: "den" } }; // this.props;
    // Send request the blockchain by calling the ApiService,
    // Get the user object and store the `win_count`, `lost_count` and `game_data` object
    return 
      ApiService.getUserByName(name).then(user => {
      setUser({
        win_count: user.win_count,
        lost_count: user.lost_count,
        game: user.game_data,
      });
      // Set the loading state to false for displaying the app
      this.setState({ loading: false });
    });
  }

  showLogin() {
    this.setState({
      isLoggingIn: true
    });
  }
  closeLogin() {
    this.setState({
      isLoggingIn: false
    });
  }

  handleStartGame() {
    // Send a request to API (blockchain) to start game
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.startGame().then(() => {
      return this.loadUser();
    });
  }

  handleRollDice() {
    this.setState({
      isUserDiceVisible: true
    });
  }

  handlePlayCard(cardIdx) {
    // Extract `user.game` of `UserReducer` from redux
    const {
      user: { game }
    } = this.props;
    // If it is an empty card, not going to do anything
    if (game.hand_player[cardIdx] === 0) {
      return;
    }
    // Show the loading indicator if the connection took too long
    this.setState({ loading: true });
    // Send a request to API (blockchain) to play card with card index
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.playCard(cardIdx).then(() => {
      return this.loadUser();
    });
  }

  handleNextRound() {
    // Send a request to API (blockchain) to trigger next round
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.nextRound().then(() => {
      return this.loadUser();
    });
  }

  handleEndGame() {
    // Send a request to API (blockchain) to end the game
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.endGame().then(() => {
      return this.loadUser();
    });
  }

  spinDice() {
    this.timerID = setInterval(() => this.roll(), 64);
  }

  roll() {
    var degOfRotation = 30;
    if (this.state.gameStatus == "Opponent's Turn") {
      this.setState({
        screenEnemyDice: [
          getRandomDieRoll(),
          getRandomDieRoll(),
          getRandomDieRoll()
        ],
        enemyRotation: this.state.enemyRotation + degOfRotation
      });
    } else if (this.state.gameStatus == "Your Turn") {
      this.setState({
        screenPlayerDice: [
          getRandomDieRoll(),
          getRandomDieRoll(),
          getRandomDieRoll()
        ],
        playerRotation: this.state.playerRotation + degOfRotation
      });
    }
  }

  render() {
    // Extract data from state and user data of `UserReducer` from redux
    const { loading } = this.state;
    const {
      user: { name, win_count, lost_count, game }
    } = {
      user: {
        name: "den",
        win_count: 0,
        lost_count: 0,
        game: { status: 0, playerDice: [1, 1, 1], enemyDice: [1, 1, 1] }
      }
    }; // this.props;

    // Flag to indicate if the game has started or not
    // By checking if the deckCard of AI is still 17 (max card)
    const isGameStarted = false; // game && game.deck_ai.length !== 17;

    const { isLoggingIn } = this.state;
    // If game hasn't started, display `PlayerProfile`
    // If game has started, display `GameMat`, `Resolution`, `Info` screen
    return (
      <section className={`Game${loading ? " loading" : ""}`}>
        {!isGameStarted ? (
          <div class="container">
            {isLoggingIn && <Login onLogin={this.closeLogin} />}
            {!isLoggingIn && (
              <Landing
                name={name}
                onLogin={this.showLogin}
                onStartGame={this.handleStartGame}
              />
            )}
          </div>
        ) : (
          <div className="container">
            <table className={"GameDice"}>
              <tbody>
                <tr>
                  <td className="dice-container dice-enemy">
                    <GameDice
                      className="dice-enemy"
                      name="enemy"
                      dice={this.state.screenEnemyDice}
                      rotation={this.state.enemyRotation}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="game-info">
                    <span>{this.state.gameStatus}</span>
                  </td>
                </tr>
                <tr>
                  <td className="dice-container dice-player">
                    <GameDice
                      className="dice-player"
                      name="player"
                      dice={this.state.screenPlayerDice}
                      rotation={this.state.playerRotation}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      onClick={() => this.spinDice()}
                      className="rollbutton"
                    >
                      ROLL
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {isGameStarted && loading && (
          <div className="spinner">
            <div className="image"></div>
            <div className="circles">
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

function getRandomDieRoll() {
  return Math.floor(Math.random() * 6 + 1); // Random int 1->6
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Game);
