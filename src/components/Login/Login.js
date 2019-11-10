import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
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
    }
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
        const cookies = new Cookies();
        cookies.set('token', body.Response.token, { path: '/' });
        cookies.set('username', body.Response.username, { path: '/' });
        cookies.set('userid', body.Response.userid, { path: '/' });
        this.setState({ loggedIn: true });
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
    const { kuski, password, loggedIn, collapsed, loading } = this.state;
    const showForm = !collapsable || !collapsed;
    return (
      <>
        {!showForm && (
          <Button
            onClick={() =>
              this.setState(state => ({ collapsed: !state.collapsed }))
            }
          >
            Log in
          </Button>
        )}
        {showForm && (
          <div className={oneLine ? s.oneLineContainer : s.container}>
            {loggedIn && !loading && (
              <div className={s.loggedIn}>
                <div>Welcome {kuski}</div>
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
                  />
                </div>
                <div className={s.buttonContainer}>
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
