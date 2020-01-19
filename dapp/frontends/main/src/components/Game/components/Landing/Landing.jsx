import React from "react";

class Landing extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoggedIn: false,
    }
  }

  render() {
    const { name, onLogin, onStartGame } = this.props;

    return (
      <div class="Landing">
        <div class="header">
          <button>Rules</button>
          <button>Theme</button>
          <button>About</button>
        </div>
        <div class="logo">
          <img src={require("./images/logo.png")} alt="logo" />
        </div>
        <div class="play">
          <button class="play-button">PLAY NOW</button>
          <button onClick={ onStartGame } class="practice-button">PRACTICE (free)</button>
        </div>
        <div class="login">
          <button onClick={ onLogin } hidden={this.state.isLoggedIn} class="login-button">LOGIN</button>
        </div>
        <div class="footer">
          {!name && "Log in to be able to play PvP and earn EOS."}
          {name}
        </div>
      </div>
    );
  }
}

export default Landing;
