import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { loginUser, logoutUser } from '../../actions/userActions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.loginUser(this.state, this.handleSuccess);
  };

  handleSuccess = () => {
    this.setState({
      username: '',
      password: '',
    });
  }

  handleLogout = () => {
    if (this.props.user.isLoggedIn) {
      console.log('Logging out')
      this.props.logoutUser({
        user_id: this.props.user.user_id
      })
    }
  }
  
  render() {
    const { username, password } = this.state;
    return (
      <>
        { this.props.user.isLoggedIn && (<Navigate to="/" replace={true} />)}
        <Form inline='true' onSubmit={this.handleSubmit}>
          <FormControl
            type="text"
            placeholder="username"
            className="mr-sm-2"
            name="username"
            value={username}
            onChange={this.handleChange}
          />
          <FormControl
            type="password"
            placeholder="password"
            className="mr-sm-2"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
          <Button variant="outline-success" type="submit">
            Login
          </Button>
          <Button variant="outline-success" onClick={this.handleLogout}>
            Logout
          </Button>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.user.error,
  user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (...args) => { dispatch(loginUser(...args)) },
        logoutUser: (...args) => { dispatch(logoutUser(...args)) }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);