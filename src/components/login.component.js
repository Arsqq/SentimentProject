import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import "./style.css";

import AuthService from "../Service/auth.service";

import { withRouter } from '../common/with-router';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.router.navigate("/profile");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
          <div className="box">
            <Form className="form" onSubmit={this.handleLogin} ref={c => {this.form = c;}}>
              <h2>Sign in</h2>
              <div className="inputBox">
                <input type="text" className="input" name="username" value={this.state.username} onChange={this.onChangeUsername}/>
                <i/>
              </div>
              <div className="inputBox">
                <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.onChangePassword} validations={[required]}/>
                <i/>
              </div>
              <button className="submitForButton">
                <span>Login</span>
              </button>
              {this.state.message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {this.state.message}
                    </div>
                  </div>
              )}
              <div className="links">
                <a href="http://localhost:3000/register">Signup</a>
              </div>
              <CheckButton style={{ display: "none" }} ref={c => {this.checkBtn = c;}}/>
            </Form>
          </div>
    );
  }
}

export default withRouter(Login);