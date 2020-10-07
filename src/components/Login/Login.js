import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { TextField, Button } from '@material-ui/core';
import Cookies from 'universal-cookie';
import Register from 'components/Register';
import ForgotPassword from 'components/ForgotPassword';
import Link from 'components/Link';
import s from './Login.css';

class Login extends React.Component {
  static propTypes = {
    oneLine: PropTypes.bool,
    collapsable: PropTypes.bool,
  };

  static defaultProps = {
    oneLine: false,
    collapsable: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      kuski: '',
      password: '',
      loggedIn: false,
      collapsed: true,
      loading: true,
      error: '',
      showRegister: false,
      showForgotPassword: false,
    };
  }

  componentDidMount() {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const username = cookies.get('username');
    const userid = cookies.get('userid');
    if (token && username && userid) {
      this.setState({
        kuski: username,
        loggedIn: true,
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  onEnter(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.login();
    }
  }

  setRegister() {
    this.setState({ showRegister: true });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  login() {
    const { kuski, password } = this.state;
    fetch('/token', {
      method: 'POST',
      body: JSON.stringify({ kuski, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      response.json().then(body => {
        if (!body.Response.success) {
          this.setState({ error: body.Response.message });
        } else {
          const cookies = new Cookies();
          cookies.set('token', body.Response.token, {
            path: '/',
            maxAge: 8640000,
          });
          cookies.set('username', body.Response.username, {
            path: '/',
            maxAge: 8640000,
          });
          cookies.set('userid', body.Response.userid, {
            path: '/',
            maxAge: 8640000,
          });
          this.setState({ loggedIn: true });
        }
      });
    });
  }

  logout() {
    const cookies = new Cookies();
    cookies.remove('token', { path: '/' });
    cookies.remove('username', { path: '/' });
    cookies.remove('userid', { path: '/' });
    this.setState({ loggedIn: false });
  }

  render() {
    const { oneLine, collapsable } = this.props;
    const {
      kuski,
      password,
      loggedIn,
      collapsed,
      loading,
      error,
      showRegister,
      showForgotPassword,
    } = this.state;
    let showForm = !collapsable || !collapsed;
    if (showRegister || showForgotPassword) {
      showForm = false;
    }
    return (
      <>
        {!showForm && !showRegister && !showForgotPassword && (
          <Button
            onClick={() =>
              this.setState({ collapsed: false, showRegister: false })
            }
          >
            Log in
          </Button>
        )}
        {showRegister && (
          <Register close={() => this.setState({ showRegister: false })} />
        )}
        {showForgotPassword && (
          <ForgotPassword
            close={() => this.setState({ showForgotPassword: false })}
          />
        )}
        {showForm && (
          <div className={oneLine ? s.oneLineContainer : s.container}>
            {loggedIn && !loading && (
              <div className={s.loggedIn}>
                <div>
                  Welcome <Link to={`/kuskis/${kuski}`}>{kuski}</Link>
                </div>
                <Button onClick={() => this.logout()} variant="contained">
                  Log out
                </Button>
              </div>
            )}
            {!loggedIn && !loading && (
              <>
                <div className={s.textfield}>
                  <TextField
                    id="standard-kuski"
                    label="Kuski"
                    value={kuski}
                    onChange={this.handleChange('kuski')}
                    margin="normal"
                    fullWidth={!oneLine}
                    onKeyPress={e => this.onEnter(e)}
                    variant="outlined"
                  />
                </div>
                <div className={s.textfield}>
                  <TextField
                    id="standard-password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    value={password}
                    onChange={this.handleChange('password')}
                    fullWidth={!oneLine}
                    onKeyPress={e => this.onEnter(e)}
                    variant="outlined"
                  />
                </div>
                <div className={s.buttonContainer}>
                  {error && <div className={s.errorMessage}>{error}</div>}
                  {!oneLine && (
                    <>
                      <Button
                        onClick={() =>
                          this.setState({ showForgotPassword: true })
                        }
                      >
                        Forgot password
                      </Button>
                      <Button onClick={() => this.setRegister()}>
                        Register
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => this.login()}
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
  }
}

export default withStyles(s)(Login);
