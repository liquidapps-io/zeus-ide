import React, { Component } from "react";
import { connect } from "react-redux";
// Services and redux action
import { UserAction } from "../../../../actions";
import { ApiService } from "../../../../services";
const ecc = require("eosjs-ecc"); // eos eliptic curve cryptography

class Login extends Component {
  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      form: {
        username: "",
        pass: "",
        key: "",
        error: ""
      },
      isSigningIn: false
    };
    // Bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Runs on every keystroke to update the React state
  handleChange(event) {
    const { name, value } = event.target;
    const { form } = this.state;
    if (name == "pass") {
      form["key"] = ecc.seedPrivate(value + form.username + "ceeleosdemo134");
    }
    this.setState({
      form: {
        ...form,
        [name]: value,
        error: ""
      }
    });
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  // Handle form submission to call api
  handleSubmit(event) {
    // Stop the default form submit browser behaviour
    event.preventDefault();
    // Extract `form` state
    const { form } = this.state;
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser } = this.props;
    // Set loading spinner to the button
    this.setState({ isSigningIn: true });
    // Send a login transaction to the blockchain by calling the ApiService,
    // If it successes, save the username to redux store
    // Otherwise, save the error state for displaying the message
    return ApiService.register(form)
      .then(() => ApiService.login(form))
      .then(() => {
        setUser({ name: form.username });
        this.props.onLogin;
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      })
      .finally(() => {
        console.log(form);
        if (this.isComponentMounted) {
          this.setState({ isSigningIn: false });
        }
      });
  }

  render() {
    const { onLogin } = this.props;
    // Extract data from state
    const { form, error, isSigningIn } = this.state;

    return (
      <div className="Login">
        <div className="logging-in">
          <div className="title">LOG IN</div>
          <div className="close">
            <button onClick={ onLogin }>
              X
            </button>
          </div>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className="field">
              <label>username: </label>
              <input
                type="text"
                name="username"
                value={form.username}
                placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
                onChange={this.handleChange}
                pattern="[\.a-z1-5]{2,12}"
                required
              />
            </div>
            <div className="field">
              <label>password: </label>
              <input
                type="password"
                name="pass"
                value={form.pass}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="field form-error">
              {error && <span className="error">{error}</span>}
            </div>
            <div className="bottom">
              <button type="submit" className="login-button" loading={isSigningIn}>
                {"Register/Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Login);
