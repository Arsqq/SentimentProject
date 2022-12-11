import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../Service/auth.service";
import "../staticFilesCss/formsStyle.css"
import {Helmet} from "react-helmet"
import { withRouter } from '../../common/with-router';

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
    const rightForm= <div className="overlay">
        <Form className="my-form" onSubmit={this.handleLogin} ref={c => {this.form = c;}}>
          <div className="con">
            <header className="head-form">
              <h2>Log In</h2>
              <p>login here using your username and password</p>
            </header>
            <br/>
            <div className="field-set"><span className="input-item"><i className="fa fa-user-circle"/></span>

            <input type="text" className="form-input" name="username" value={this.state.username} onChange={this.onChangeUsername}/>
              <br/>
              <span className="input-item"><i className="fa fa-key"/></span>
            <input type="password" className="form-input" name="password" value={this.state.password} onChange={this.onChangePassword} validations={[required]}/>
              <button className="button-custom" type="submit"> Log In</button>
          {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
          )}
              <div className="other">
                <a className="btn submits sign-up" href="/register">Sign Up<i className="fa fa-user-plus" aria-hidden="true"/></a>
              </div>
            </div>
          </div>
          <CheckButton style={{ display: "none" }} ref={c => {this.checkBtn = c;}}/>
        </Form>
      </div>
    return (
        rightForm
    );
  }
}

export default withRouter(Login);